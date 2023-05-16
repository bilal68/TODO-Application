import * as model from "../../models";
import fs from "fs";
import path from "path";
import { successResponse, errorResponse } from "../../helpers";
const archiver = require("archiver");

const { task, attachment } = model;

export const create = async (req, res) => {
  const t = await model.sequelize.transaction();
  try {
    let count = await task.count({
      fk_user_id: req.user.userId,
    });
    if (count >= 50) throw Error("User list full!");
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
export const getAttachmentsOfTaskById = async (req, res) => {
  try {
    let result = await task.findOne({
      where: { fk_user_id: req.user.userId, id: req.params.id },
      include: [{ model: attachment, as: "Attachments" }],
    });
    if (!result) throw new Error("Task not found");
    if (result["Attachments"] && result["Attachments"].length > 0) {
      const archive = archiver("zip", { zlib: { level: 9 } });
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="task_${req.params.id}_attachments.zip"`
      );
      archive.pipe(res);
      result["Attachments"].forEach((attachment) => {
        const filePath = path.join("./uploads", attachment.file_name);
        if (fs.existsSync(filePath)) {
          const fileStats = fs.statSync(filePath);
          // Add the file to the zip archive
          archive.append(fs.createReadStream(filePath), {
            name: attachment.file_name,
            size: fileStats.size,
          });
        }
      });
      archive.finalize();
    }
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
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }
    await result.destroy({ transaction: t });
    await t.commit();
    return successResponse(req, res, {
      message: "Success",
    });
  } catch (error) {
    await t.rollback();
    return errorResponse(req, res, error.message);
  }
};

export const update = async (req, res) => {
  const t = await model.sequelize.transaction();
  try {
    const targetTask = await task.findOne({
      where: { id: req.params.id },
      include: [{ model: attachment, as: "Attachments" }],
    });
    const [, updatedRows] = await task.update(
      {
        ...req.body,
      },
      { where: { id: req.params.id }, returning: true },
      { transaction: t }
    );
    if (req.files && req.files.length > 0) {
      const attachments = req.files.map((file) => ({
        fk_task_id: req.params.id,
        original_name: file.originalname,
        file_name: file.filename,
      }));
      await Promise.all(
        attachments.map(async (file) => {
          const existingAttachment = targetTask.Attachments.find(
            (a) => a.original_name === file.original_name
          );
          await attachment.upsert(
            {
              ...(existingAttachment && {
                id: existingAttachment.id,
              }),
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
    await t.commit();
    const result = await task.findOne({
      where: { id: req.params.id },
      include: [{ model: attachment, as: "Attachments" }],
    });
    return successResponse(req, res, {
      message: "Task updated successfully",
      data: result,
    });
  } catch (error) {
    await t.rollback();
    return errorResponse(req, res, error.message);
  }
};

