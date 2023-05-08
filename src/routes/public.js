import express from "express";
import passport from "passport";

import { generateToken } from "../config/jwt";

import { validate } from "../middleware/validate";

import * as userController from "../controllers/user/user.controller";
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
router.post("/register", userController.userRegister);
router.get("/verify/email", userController.verifyEmailAddress);

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
 *  /restaurants/:
 *    get:
 *      summary: Lists all the restaurants
 *      tags: [Restaurants]
 *      parameters:
 *        - name: 'day'
 *          in: 'query'
 *          schema:
 *            type: string
 *            format: 'sunday'
 *        - name: 'from'
 *          in: 'query'
 *          schema:
 *            type: 'time'
 *            format: '09:00'
 *        - name: 'to'
 *          in: 'query'
 *          schema:
 *            type: 'time'
 *            format: '20:00'
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
 *                   type: array
 *                   items:
 *                   properties:
 *                      restaurantName:
 *                        type: string
 *                      cashBalance:
 *                        type: integer
 *                 success:
 *                  type: boolean
 */
// Define the OAuth2 route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
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
  passport.authenticate("local", { session: false }),
  (req, res) => {
    // Generate a JWT token and send it to the client
    const token = generateToken({ userId: req.user.id });
    res.json(token);
  }
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Generate a JWT token and send it to the client
    const token = generateToken({ userId: req.user.id });
    res.json(token);
  }
);

module.exports = router;
