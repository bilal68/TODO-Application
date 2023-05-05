import * as model from "../../models";
import { successResponse, errorResponse } from "../../helpers";
const moment = require("moment");

export const healthCheck = async (req, res) => {
  try {
    return successResponse(req, res, { message: "working" });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const purchase = async (req, res) => {
  const t = await model.sequelize.transaction();
  try {
    const { userId, menuId } = req.body;
    const user = await model.Users.findOne({
      where: {
        id: userId,
      },
      include: [],
    });
    console.log(user);
    if (!user) throw { message: "User not found." };
    const menu = await model.Menus.findOne({
      where: {
        id: menuId,
      },
      include: [],
    });

    if (!menu) throw { message: "Menu not found." };

    const restaurant = await model.Restaurants.findOne({
      where: {
        id: menu.fk_restaurant_id,
      },
    });

    if (!restaurant) throw { message: "Restaurant not found." };

    if (user.cashBalance < menu.price)
      throw { message: "User do not have enough cash" };
    const purchaseHistory = await model.PurchaseHistory.create(
      {
        transactionDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        transactionAmount: menu.price,
        fk_user_id: user.id,
      },
      { transaction: t }
    );
    await menu.addPurchaseHistory(purchaseHistory, { transaction: t });

    const newUserBalance = user.cashBalance - menu.price;
    const updatedUser = await user.update(
      { cashBalance: newUserBalance },
      { where: { id: user.id }, returning: true, plain: true, transaction: t }
    );
    const newRestaurantBalance = restaurant.cashBalance + menu.price;
    await restaurant.update(
      { cashBalance: newRestaurantBalance },
      {
        where: { id: restaurant.id },
        returning: true,
        plain: true,
        transaction: t,
      }
    );
    await t.commit();
    return successResponse(req, res, {
      message: "User purchased successfully",
    });
  } catch (error) {
    await t.rollback();
    return errorResponse(req, res, error.message);
  }
};
