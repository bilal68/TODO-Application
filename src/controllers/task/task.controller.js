import * as model from "../../models";
import fs from "fs";
import path from "path";
import { successResponse, errorResponse } from "../../helpers";

const { task, attachment } = model;

export const create = async (req, res) => {
  const t = await model.sequelize.transaction();
  try {
    let result = await task.create(
      {
        fk_user_id: req.user.userId,
        ...req.body,
      },
      { transaction: t }
    );
    if (req.files && req.files.length > 0) {
      const attachments = req.files.map((file) => ({
        original_name: file.originalname,
        file_name: file.filename,
      }));
      await Promise.all(
        attachments.map(async (file) => {
          const createdAttachment = await attachment.create(
            {
              fk_task_id: result.id,
              ...file,
            },
            { transaction: t }
          );
        })
      );
    }
    result = result.toJSON();
    await t.commit();
    return successResponse(req, res, {
      message: "Task created successfully",
      data: result,
    });
  } catch (error) {
    await t.rollback();
    return errorResponse(req, res, error.message);
  }
};

export const getTaskList = async (req, res) => {
  try {
    let result = await task.findAll({
      where: { fk_user_id: req.user.userId },
      include: [{ model: attachment, as: "Attachments" }],
    });
    return successResponse(req, res, {
      message: "Success",
      data: result,
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
export const getTaskById = async (req, res) => {
  try {
    let result = await task.findOne({
      where: { fk_user_id: req.user.userId, id: req.params.id },
      include: [{ model: attachment, as: "Attachments" }],
    });
    if (!result) throw new Error("Task not found");
    return successResponse(req, res, {
      message: "Success",
      data: result,
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const deleteTaskById = async (req, res) => {
  const t = await model.sequelize.transaction();
  try {
    let result = await task.findOne({
      where: { fk_user_id: req.user.userId, id: req.params.id },
      include: [{ model: attachment, as: "Attachments" }],
    });
    if (!result) throw new Error("Task not found");
    if (result["Attachments"] && result["Attachments"].length > 0) {
      result["Attachments"].forEach((attachment) => {
        const filePath = path.join("./uploads", attachment.file_name);
        fs.unlinkSync(filePath);
      });
    }
    await result.destroy({ transaction: t });
    await t.commit();
    return successResponse(req, res, {
      message: "Success",
      data: result,
    });
  } catch (error) {
    await t.rollback();
    return errorResponse(req, res, error.message);
  }
};

export const update = async (req, res) => {
  const t = await model.sequelize.transaction();
  try {
    const [, updatedRows] = await task.update(
      {
        ...req.body,
      },
      { where: { id: req.params.id }, returning: true },
      { transaction: t }
    );
    if (req.files && req.files.length > 0) {
      const attachments = [];
      for (let file of req.files) {
        if (!fs.existsSync(path.join("./uploads", file.originalname)))
          attachments.push({
            fk_task_id: req.params.id,
            original_name: file.originalname,
            file_name: file.filename,
          });
      }
      await Promise.all(
        attachments.map(async (file) => {
          await attachment.upsert(
            {
              ...file,
            },
            { transaction: t }
          );
        })
      );
    }
    if ((!updatedRows || updatedRows === 0) && req.files.length === 0) {
      throw new Error("Task not found");
    }
    const result = await task.findOne({
      where: { id: req.params.id },
      include: [{ model: attachment, as: "Attachments" }],
    });
    await t.commit();
    return successResponse(req, res, {
      message: "Task created successfully",
      data: result,
    });
  } catch (error) {
    await t.rollback();
    return errorResponse(req, res, error.message);
  }
};
