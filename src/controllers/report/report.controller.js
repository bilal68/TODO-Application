import * as model from "../../models";
import { successResponse, errorResponse } from "../../helpers";
import moment from "moment";
import { Op } from "sequelize";

const { task, user, sequelize } = model;

export const getTaskCounts = async (req, res) => {
  try {
    const taskCounts = await task.findOne({
      attributes: [
        [sequelize.fn("count", sequelize.col("id")), "totalTasks"],
        [
          sequelize.fn(
            "sum",
            sequelize.literal(
              "CASE WHEN completion_status = true THEN 1 ELSE 0 END"
            )
          ),
          "completedTasks",
        ],
        [
          sequelize.fn(
            "sum",
            sequelize.literal(
              "CASE WHEN completion_status = false THEN 1 ELSE 0 END"
            )
          ),
          "remainingTasks",
        ],
      ],
    });
    const { totalTasks, completedTasks, remainingTasks } = taskCounts.toJSON();
    return successResponse(req, res, {
      message: "Success",
      data: {
        totalTasks: totalTasks,
        completedTasks: +completedTasks,
        remainingTasks: +remainingTasks,
      },
      // lets test
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getAveragePerDayCompletedTasks = async (req, res) => {
  try {
    // Get the user's creation date
    const dbUser = await user.findOne({ where: { id: req.user.userId } });
    const accountCreationDate = dbUser.createdAt;

    // Compute the average number of tasks completed per day
    const tasksCompletedPerDay = await task.count({
      where: {
        fk_user_id: req.user.userId,
        completion_status: true,
        completion_date: { [Op.ne]: null },
      },
    });

    const daysSinceCreation = moment().diff(
      moment(accountCreationDate),
      "days"
    );
    const averageTasksCompletedPerDay =
      tasksCompletedPerDay / daysSinceCreation;

    return successResponse(req, res, {
      message: "Success",
      data: {
        averageTasksCompletedPerDay: averageTasksCompletedPerDay,
      },
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getTasksNotCompletedOnTimeCount = async (req, res) => {
  try {
    const tasksNotCompletedOnTimeCount = await task.count({
      where: {
        completion_date: {
          [Op.gt]: sequelize.col("due_date"),
        },
      },
    });
    return successResponse(req, res, {
      message: "Success",
      data: {
        tasksNotCompletedOnTimeCount: tasksNotCompletedOnTimeCount,
      },
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getMaxTasksCompletedDate = async (req, res) => {
  try {
    const maxTasksCompletedDate = await task.findOne({
      attributes: [
        [sequelize.fn("date", sequelize.col("completion_date")), "date"],
        [sequelize.fn("count", sequelize.col("task.id")), "taskCount"],
      ],
      where: {
        completion_date: {
          [Op.ne]: null,
        },
        createdAt: {
          [Op.gte]: sequelize.col("User.createdAt"),
        },
      },
      include: [
        {
          model: user,
          as: "User",
          attributes: [],
        },
      ],
      group: [sequelize.fn("date", sequelize.col("completion_date"))],
      order: [[sequelize.literal("taskCount"), "DESC"]],
      limit: 1,
    });

    const { date, taskCount } = maxTasksCompletedDate.toJSON();
    return successResponse(req, res, {
      message: "Success",
      data: {
        date: date,
        taskCount: taskCount,
      },
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getTasksPerDayOfWeek = async (req, res) => {
  try {
    const tasksPerDayOfWeek = await task.findAll({
      attributes: [
        [sequelize.fn("DAYNAME", sequelize.col("task.createdAt")), "dayOfWeek"],
        [sequelize.fn("COUNT", sequelize.col("task.id")), "taskCount"],
      ],
      group: [sequelize.fn("DAYNAME", sequelize.col("task.createdAt"))],
      include: [
        {
          model: user,
          as: "User",
          attributes: [],
          where: {
            createdAt: {
              [Op.lte]: sequelize.col("task.createdAt"),
            },
          },
        },
      ],
    });
    return successResponse(req, res, {
      message: "Success",
      data: {
        tasksPerDayOfWeek: tasksPerDayOfWeek,
      },
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getDuplicateTasks = async (req, res) => {
  try {
    const duplicateTasks = await task.findAll({
      where: {
        title: {
          [Op.in]: sequelize.literal(
            `(SELECT title FROM task GROUP BY title HAVING COUNT(*) > 1)`
          ),
        },
      },
      order: [["createdAt", "ASC"]],
    });

    const tasks = [];

    // Create a map to store the primary task for each title
    const primaryTasksMap = new Map();

    duplicateTasks.forEach((task) => {
      if (!primaryTasksMap.has(task.title)) {
        primaryTasksMap.set(task.title, {
          primaryTask: task,
          duplicateTasks: [],
        });
      } else {
        // If the title is already in the map, it means the task is a duplicate
        const primaryTaskData = primaryTasksMap.get(task.title);

        primaryTaskData.duplicateTasks.push(task);
      }
    });
    primaryTasksMap.forEach((value) => {
      tasks.push(value);
    });

    return successResponse(req, res, {
      message: "Success",
      data: {
        duplicateTasks: tasks,
      },
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
