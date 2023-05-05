import * as model from "../../models";
import { successResponse, errorResponse } from "../../helpers";
const moment = require("moment");
const { Sequelize, Op } = require("sequelize");

export const getRestaurants = async (req, res) => {
  try {
    const { day, from, to } = req.query;

    const results = await model.Restaurants.findAll({
      attributes: { exclude: ["id", "BusinessHours"] },
      include: [
        {
          model: model.BusinessHours,
          as: "BusinessHours",
          where: {
            dayOfWeek: moment(day, "ddd").format("dddd"),
            openTime: {
              [Op.gte]: moment(from, "HH:mm").format("HH:mm:ss"),
            },
            closeTime: {
              [Op.lte]: moment(to, "HH:mm").format("HH:mm:ss"),
            },
          },
          attributes: []
        },
      ],
      order: [["restaurantName", "DESC"]],
    });
    return successResponse(req, res, results);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const fetchRestaurants = async (req, res) => {
  try {
    const { numberOfDishes } = req.params;
    const { minPrice, maxPrice } = req.query;
    const results = await model.Restaurants.findAll({
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("Menus.id")), "noOfDishes"],
        ],
        exclude: ["id", "noOfDishes"],
      },
      include: [
        {
          model: model.Menus,
          as: "Menus",
          attributes: [],
          where: {
            price: {
              [Op.between]: [
                Number(minPrice).toFixed(2),
                Number(maxPrice).toFixed(2),
              ],
            },
          },
        },
      ],
      group: ["id"],
      having: Sequelize.where(
        Sequelize.col("noOfDishes"),
        Op.gt,
        numberOfDishes
      ),
      order: [["restaurantName", "ASC"]],
    });
    return successResponse(req, res, results);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const search = async (req, res) => {
  try {
    const { searchString } = req.params;
    const results = await model.sequelize.query(
      `SELECT restaurants.restaurantName,menus.dishName, 
    MATCH(restaurants.restaurantName) AGAINST('${searchString}' IN BOOLEAN MODE) as mscore,
    MATCH(menus.dishName) AGAINST('${searchString}' IN BOOLEAN MODE) as rscore
  FROM restaurants 
    LEFT JOIN menus ON menus.fk_restaurant_id= restaurants.id
   WHERE 
   MATCH(restaurants.restaurantName) AGAINST('${searchString}' IN BOOLEAN MODE) > 0 
  OR MATCH(menus.dishName) AGAINST('${searchString}' IN BOOLEAN MODE) > 0
  ORDER BY (mscore + rscore) DESC`,
      { type: model.sequelize.QueryTypes.SELECT }
    );
    return successResponse(req, res, results);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
