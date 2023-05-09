import express from "express";
import passport from "passport";

import { generateToken } from "../config/jwt";

import { validate } from "../middleware/validate";

import * as userController from "../controllers/user/user.controller";
import * as authController from "../controllers/auth/auth.controller";
import * as userValidator from "../controllers/user/user.validator";

const router = express.Router();

//= ===============================
// Public routes
//= ===============================

/**
 *  @swagger
 *  /health-check/:
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
router.get("/health-check", userController.healthCheck);

/**
 *  @swagger
 *  /health-check/:
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
router.post(
  "/register",
  validate(userValidator.userRegister, "body"),
  userController.userRegister
);

/**
 *  @swagger
 *  /health-check/:
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
router.get(
  "/verify/email",
  validate(userValidator.verifyEmailAddress, "query"),
  userController.verifyEmailAddress
);

// Define the OAuth2 route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  authController.login
  // (req, res) => {
  //   // Generate a JWT token and send it to the client
  //   const token = generateToken({ userId: req.user.id, loginType: "oAuth2" });
  //   res.json(token);
  // }
);

/**
 *  @swagger
 *  /health-check/:
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
router.post(
  "/login",
  validate(userValidator.login, "body"),
  passport.authenticate("local", { session: false }),
  authController.login
);
module.exports = router;
