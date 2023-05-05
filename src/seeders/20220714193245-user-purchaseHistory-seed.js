"use strict";
const { v4: uuidv4 } = require("uuid");
// const models = require("../models");
const moment = require("moment");

const userWithPurchaseHistory = require("../seeds/users_with_purchase_history.json");
// const userWithPurchaseHistory = require("../seeds/test.json");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let users = [];
    let purchaseHistory = [];
    let menuPurchaseHistory = [];
    for (let rIndex = 0; rIndex < userWithPurchaseHistory.length; rIndex++) {
      console.log("File Record =====>", rIndex);
      let userId = uuidv4();
      const element = userWithPurchaseHistory[rIndex];
      users.push({
        id: userId,
        name: element.name,
        cashBalance: element.cashBalance,
      });

      for (let mIndex = 0; mIndex < element.purchaseHistory.length; mIndex++) {
       
        let purchaseId = uuidv4();
        const item = element.purchaseHistory[mIndex];
        console.log("Purchase Item =====>", item.restaurantName);
        const restaurant = await queryInterface.sequelize.query(
          `SELECT * FROM Restaurants WHERE restaurantName = "${item.restaurantName.replace(/\s+/g,' ').trim()}" limit 1`,
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
          }
        );

        const menu = await queryInterface.sequelize.query(
          `SELECT * FROM Menus WHERE dishName = "${item.dishName.replace(/\s+/g,' ').trim()}" AND fk_restaurant_id='${restaurant[0].id}' limit 1`,
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
          }
        );
        // const restaurant = await models.Restaurants.findOne({
        //   where: { restaurantName: item.restaurantName },
        // });
        // const menu = await models.Menus.findOne({
        //   where: { dishName: item.dishName, fk_restaurant_id: restaurant.id },
        // });
        purchaseHistory.push({
          id: purchaseId,
          transactionDate: moment(item.transactionDate,'MM/DD/YYYY HH:mm A').format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          transactionAmount: item.transactionAmount,
          fk_user_id: userId,
          // fk_restaurant_id: restaurant[0].id,
        });
        menuPurchaseHistory.push({
          MenuId: menu[0].id,
          PurchaseHistoryId: purchaseId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    console.log(users);
    console.log(purchaseHistory);
    console.log(menuPurchaseHistory);
    const promises = [
      await queryInterface.bulkInsert("Users", users),
      await queryInterface.bulkInsert("PurchaseHistory", purchaseHistory),
      await queryInterface.bulkInsert(
        "MenuPurchaseHistory",
        menuPurchaseHistory
      ),
    ];
    await Promise.all(promises);
  },

  down: async (queryInterface, Sequelize) => {
    const promises = [
      queryInterface.bulkDelete("Users", null, {}),
      queryInterface.bulkDelete("PurchaseHistory", null, {}),
      queryInterface.bulkDelete("MenuPurchaseHistory", null, {}),
    ];
    await Promise.all(promises);
  },
};
