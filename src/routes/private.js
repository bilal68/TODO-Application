import express from "express";
import passport from "passport";

import multer from "multer";
import { validate } from "../middleware/validate";

import * as userController from "../controllers/user/user.controller";
import * as taskController from "../controllers/task/task.controller";

import * as userValidator from "../controllers/user/user.validator";
import * as taskValidator from "../controllers/task/task.validator";

const router = express.Router();
const { diskStorage } = require('../helpers');
const upload = multer({ storage: diskStorage() });
//= ===============================
// Private routes
//= ===============================

/**
 *  @swagger
 *  /protected/:
 *    get:
 *      summary: Lists all the restaurants
 *      tags: [Default]
 *      responses:
 *        200:
 *          description: Success Response
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                 code:
 *                  type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                      message:
 *                        type: string
 *                 success:
 *                  type: boolean
 */
router.patch(
  "/reset/password",
  passport.authenticate("jwt", { session: false }),
  validate(userValidator.resetPassword, "body"),
  userController.resetPassword
);

router.post(
  "/task",
  passport.authenticate("jwt", { session: false }),
  upload.array("attachments", 5),
  validate(taskValidator.create, "body"),
  taskController.create
);
router.get(
  "/task/:id(\\d+)",
  passport.authenticate("jwt", { session: false }),
  validate(taskValidator.taskById, "params"),
  taskController.getTaskById
);

router.get(
  "/task",
  passport.authenticate("jwt", { session: false }),
  taskController.getTaskList
);

router.delete(
  "/task/:id(\\d+)",
  passport.authenticate("jwt", { session: false }),
  validate(taskValidator.taskById, "params"),
  taskController.deleteTaskById
);

router.put(
  "/task/:id(\\d+)",
  passport.authenticate("jwt", { session: false }),
  upload.array("attachments", 5),
  validate(taskValidator.taskById, "params"),
  taskController.update
);

module.exports = router;
