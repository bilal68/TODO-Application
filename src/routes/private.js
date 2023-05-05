import express from "express";
import passport from "passport";

import { validate } from "../middleware/validate";

import * as userController from "../controllers/user/user.controller";
import * as userValidator from "../controllers/user/user.validator";
import * as restaurantController from "../controllers/restaurant/restaurant.controller";
import * as restaurantValidator from "../controllers/restaurant/restaurant.validator";

const router = express.Router();

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
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send("welcome");
  }
);

module.exports = router;
