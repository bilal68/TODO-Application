import express from "express";
import passport from "passport";

import multer from "multer";
import { validate } from "../middleware/validate";

import * as userController from "../controllers/user/user.controller";
import * as taskController from "../controllers/task/task.controller";
import * as reportController from "../controllers/report/report.controller";

import * as userValidator from "../controllers/user/user.validator";
import * as taskValidator from "../controllers/task/task.validator";

const router = express.Router();
const { diskStorage } = require("../helpers");
const upload = multer({ storage: diskStorage() });
//= ===============================
// Private routes
//= ===============================

/**
 *  @swagger
 *  /reset/password:
 *    patch:
 *      summary: Reset user password
 *      tags: [User]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                  required: true
 *                confirm_password:
 *                  type: string
 *                  required: true
 *      responses:
 *        200:
 *          description: Success Response
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  code:
 *                    type: integer
 *                  data:
 *                    type: object
 *                    properties:
 *                      message:
 *                        type: string
 *                  success:
 *                    type: boolean
 */
router.patch(
  "/reset/password",
  passport.authenticate("jwt", { session: false }),
  validate(userValidator.resetPassword, "body"),
  userController.resetPassword
);

/**
 *  @swagger
 *  /task:
 *    post:
 *      summary: Add task
 *      tags: [Tasks]
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  required: true
 *                description:
 *                  type: string
 *                  required: true
 *                due_date:
 *                  type: string
 *                  format: date
 *                  required: true
 *                completion_date:
 *                  type: string
 *                  format: date
 *                  nullable: true
 *                completion_status:
 *                  type: boolean
 *                  nullable: true
 *                attachments:
 *                  type: array
 *                  items:
 *                    type: file
 *                  required: false
 *                  description: Multiple attachments can be uploaded
 *      responses:
 *        200:
 *          description: Success Response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TaskResponse'
 *      security:
 *       - BearerAuth: []
 *
 * components:
 *   schemas:
 *     TaskResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *         data:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *         success:
 *           type: boolean
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         due_date:
 *           type: string
 *           format: date
 *         completion_date:
 *           type: string
 *           format: date
 *           nullable: true
 *         completion_status:
 *           type: boolean
 *           nullable: true
 *         attachments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Attachment'
 *     Attachment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         task_id:
 *           type: integer
 *         file_name:
 *           type: string
 *         original_name:
 *           type: string
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.post(
  "/task",
  passport.authenticate("jwt", { session: false }),
  upload.array("attachments", 5),
  validate(taskValidator.create, "body"),
  taskController.create
);

/**
 *  @swagger
 *  /task/{id}:
 *    get:
 *      summary: Get a task by ID
 *      tags: [Tasks]
 *      security:
 *        - BearerAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Task ID
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *        200:
 *          description: Success Response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TaskResponse'
 *        404:
 *          description: Task not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *
 * components:
 *   schemas:
 *     ErrorResponse:
 *       $ref: '#/components/schemas/ErrorResponse'
 *     TaskResponse:
 *       $ref: '#/components/schemas/TaskResponse'
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get(
  "/task/:id(\\d+)",
  passport.authenticate("jwt", { session: false }),
  validate(taskValidator.taskById, "params"),
  taskController.getTaskById
);

/**
 *  @swagger
 *  /task:
 *    get:
 *      summary: Get all tasks
 *      tags: [Tasks]
 *      security:
 *        - BearerAuth: []
 *      responses:
 *        200:
 *          description: Success Response
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/TaskResponse'
 *        404:
 *          description: Tasks not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 * components:
 *   schemas:
 *     ErrorResponse:
 *       $ref: '#/components/schemas/ErrorResponse'
 *     TaskResponse:
 *       $ref: '#/components/schemas/TaskResponse'
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get(
  "/task",
  passport.authenticate("jwt", { session: false }),
  taskController.getTaskList
);

/**
 *  @swagger
 *  /task/{id}:
 *    delete:
 *      summary: Delete a task by ID
 *      tags: [Tasks]
 *      security:
 *        - BearerAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Task ID
 *          required: true
 *          schema:
 *            type: integer
 *      responses:
 *        204:
 *          description: Task successfully deleted
 *        404:
 *          description: Task not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *
 * components:
 *   schemas:
 *     ErrorResponse:
 *       $ref: '#/components/schemas/ErrorResponse'
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.delete(
  "/task/:id(\\d+)",
  passport.authenticate("jwt", { session: false }),
  validate(taskValidator.taskById, "params"),
  taskController.deleteTaskById
);

/**
 *  @swagger
 *  /task/{id}:
 *    put:
 *      summary: Update a task
 *      tags: [Tasks]
 *      security:
 *        - BearerAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Task ID
 *          required: true
 *          schema:
 *            type: integer
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/TaskUpdateRequest'
 *      responses:
 *        200:
 *          description: Success Response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TaskResponse'
 *        400:
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *        404:
 *          description: Task not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *
 * components:
 *   schemas:
 *     ErrorResponse:
 *       $ref: '#/components/schemas/ErrorResponse'
 *     TaskResponse:
 *       $ref: '#/components/schemas/TaskResponse'
 *     TaskUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         due_date:
 *           type: string
 *           format: date-time
 *         completion_date:
 *           type: string
 *           format: date
 *           nullable: true
 *         completion_status:
 *           type: boolean
 *         attachments:
 *           type: array
 *           items:
 *             type: file
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.put(
  "/task/:id(\\d+)",
  passport.authenticate("jwt", { session: false }),
  upload.array("attachments", 5),
  validate(taskValidator.taskById, "params"),
  taskController.update
);

/**
 * @swagger
 * /download/task/attachment/{id}:
 *   get:
 *     summary: Download attachments for a task
 *     tags: [Tasks]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Task ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success Response
 *         content:
 *           application/zip:
 *             schema:
 *               type: string
 *               format: binary
 *     security:
 *       - BearerAuth: []
 *
 * components:
 *   schemas:
 *     ErrorResponse:
 *       $ref: '#/components/schemas/ErrorResponse'
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get(
  "/download/task/attachment/:id(\\d+)",
  passport.authenticate("jwt", { session: false }),
  validate(taskValidator.taskById, "params"),
  taskController.getAttachmentsOfTaskById
);

/**
 *  @swagger
 *  /report/totalSumOfTasks:
 *    get:
 *      summary: Get the total count of tasks
 *      tags: [Reports]
 *      responses:
 *        200:
 *          description: Success Response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TotalTasksResponse'
 *      security:
 *       - BearerAuth: []
 *
 * components:
 *   schemas:
 *     TotalTasksResponse:
 *       type: object
 *       properties:
 *         totalTasks:
 *           type: integer
 *         completedTasks:
 *           type: integer
 *         remainingTasks:
 *           type: integer
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get(
  "/report/totalSumOfTasks",
  passport.authenticate("jwt", { session: false }),
  reportController.getTaskCounts
);

/**
 *  @swagger
 *  /report/averagePerDayCompletedTasks:
 *    get:
 *      summary: Get the average completed tasks for a day
 *      tags: [Reports]
 *      responses:
 *        200:
 *          description: Success Response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AveragePerDayCompletedTasks'
 *      security:
 *       - BearerAuth: []
 *
 * components:
 *   schemas:
 *     AveragePerDayCompletedTasks:
 *       type: object
 *       properties:
 *         averageTasksCompletedPerDay:
 *           type: integer
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get(
  "/report/averagePerDayCompletedTasks",
  passport.authenticate("jwt", { session: false }),
  reportController.getAveragePerDayCompletedTasks
);

/**
 *  @swagger
 *  /report/tasksNotCompletedOnTime:
 *    get:
 *      summary: Get the average completed tasks for a day
 *      tags: [Reports]
 *      responses:
 *        200:
 *          description: Success Response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TasksNotCompletedOnTimeCount'
 *      security:
 *       - BearerAuth: []
 *
 * components:
 *   schemas:
 *     TasksNotCompletedOnTimeCount:
 *       type: object
 *       properties:
 *         tasksNotCompletedOnTimeCount:
 *           type: integer
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get(
  "/report/tasksNotCompletedOnTime",
  passport.authenticate("jwt", { session: false }),
  reportController.getTasksNotCompletedOnTimeCount
);

/**
 *  @swagger
 *  /report/maxTasksCompletedDate:
 *    get:
 *      summary: Get the max tasks completed on a date
 *      tags: [Reports]
 *      responses:
 *        200:
 *          description: Success Response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/MaxTasksCompletedDate'
 *      security:
 *       - BearerAuth: []
 *
 * components:
 *   schemas:
 *     MaxTasksCompletedDate:
 *       type: object
 *       properties:
 *         maxTasksCompletedDate:
 *           type: integer
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get(
  "/report/maxTasksCompletedDate",
  passport.authenticate("jwt", { session: false }),
  reportController.getMaxTasksCompletedDate
);

/**
 *  @swagger
 *  /report/tasksPerDayOfWeek:
 *    get:
 *      summary: Get the tasks per day of the week
 *      tags: [Reports]
 *      responses:
 *        200:
 *          description: Success Response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TasksPerDayOfWeek'
 *      security:
 *       - BearerAuth: []
 *
 * components:
 *   schemas:
 *     TasksPerDayOfWeek:
 *       type: object
 *       properties:
 *         tasksPerDayOfWeek:
 *           type: integer
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get(
  "/report/tasksPerDayOfWeek",
  passport.authenticate("jwt", { session: false }),
  reportController.getTasksPerDayOfWeek
);

/**
 *  @swagger
 *  /report/duplicateTasks:
 *    get:
 *      summary: Get duplicate tasks based on titles
 *      tags: [Reports]
 *      responses:
 *        200:
 *          description: Success Response
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/DuplicateTasksResponse'
 *      security:
 *       - BearerAuth: []
 *
 * components:
 *   schemas:
 *     DuplicateTasksResponse:
 *       type: object
 *       properties:
 *         tasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Task'
 *     Task:
 *       type: object
 *       properties:
 *         primaryTask:
 *           $ref: '#/components/schemas/TaskDetails'
 *         duplicateTasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TaskDetails'
 *     TaskDetails:
 *       $ref: '#/components/schemas/Task'
 *
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get(
  "/report/duplicateTasks",
  passport.authenticate("jwt", { session: false }),
  reportController.getDuplicateTasks
);
module.exports = router;
