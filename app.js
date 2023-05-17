import express from "express";
import dotenv from "dotenv";

import bodyParser from "body-parser";
import cors from "cors";

import publicRoutes from "./src/routes/public";
import privateRoutes from "./src/routes/private";
import errorHandler from "./src/middleware/errorHandler";
const swaggerUi = require("swagger-ui-express");

dotenv.config();
require("./src/config/sequelize");
require("./src/config/passport");
require("./src/crons/dailyReminder");

const app = express();
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo List",
      version: "1.0.0",
    },
  },
  // swaggerDefinition: {
  //   tags: [
  //     {
  //       name: "Default",
  //       description: "Default operations",
  //     },
  //     {
  //       name: "Auth",
  //       description: "Authentication operations",
  //     },
  //     {
  //       name: "User",
  //       description: "User operations",
  //     },
  //   ],
  // },
  apis: ["./src/routes/*.js"], // files containing annotations as above
};

const openApiSpecification = swaggerJsdoc(options);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpecification));
app.use(publicRoutes);
app.use(privateRoutes);
app.use(errorHandler);

module.exports = app;
