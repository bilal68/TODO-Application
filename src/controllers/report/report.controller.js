import * as model from "../../models";
import { successResponse, errorResponse } from "../../helpers";
import moment from "moment";
import { Op } from 'sequelize';

const { task, user } = model;

export const getTaskCounts = async (req, res) => {
  try {
    const taskCounts = await task.findOne({
      attributes: [
        [model.sequelize.fn("count", model.sequelize.col("id")), "totalTasks"],
        [
          model.sequelize.fn(
            "sum",
            model.sequelize.literal(
              "CASE WHEN completion_status = true THEN 1 ELSE 0 END"
            )
          ),
          "completedTasks",
        ],
        [
          model.sequelize.fn(
            "sum",
            model.sequelize.literal(
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
