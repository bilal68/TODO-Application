"use strict";
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const restaurantsWithMenu = require("../seeds/restaurant_with_menu.json");
// const restaurantsWithMenu = require("../seeds/test.json");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let restaurants = [];
    let businessHours = [];
    let menus = [];
    for (let rIndex = 0; rIndex < restaurantsWithMenu.length; rIndex++) {
      console.log("File Record =====>", rIndex);
      let restaurantId = uuidv4();
      const element = restaurantsWithMenu[rIndex];
      let restaurantTimings = element.openingHours.split("/");

      for (let rtIndex = 0; rtIndex < restaurantTimings.length; rtIndex++) {
        console.log("Menu Item =====>", rtIndex);
        const weekDaysTimingString = restaurantTimings[rtIndex];
        let weekDaysTimingArray = weekDaysTimingString.split(",").reverse();

        console.log("weekDaysTimingArray FOR======>", weekDaysTimingArray);

        // if (weekDaysTimingArray.length > 2) {
        let openTime, closeTime, dayOfTheWeek;
        for (
          let wdtaIndex = 0;
          wdtaIndex < weekDaysTimingArray.length;
          wdtaIndex++
        ) {
          const weekDays = weekDaysTimingArray[wdtaIndex];
          let weekDaysArr = weekDays.split("-");
          console.log("weekDaysArr FOR======>", weekDaysArr);

          for (let wdaIndex = 0; wdaIndex < weekDaysArr.length; wdaIndex++) {
            let obj = {};
            const day = weekDaysArr[wdaIndex].trim();
            console.log("day FOR======>", day);
            if (moment(day, "ddd").isValid()) {
              dayOfTheWeek = moment(day, "ddd LT").format("dddd");
            }
            if (moment(day, "ddd").isValid() && moment(day, "LT").isValid()) {
              openTime = moment(day, "LT").format("HH:mm");
            } else if (moment(day, "LT").isValid()) {
              closeTime = moment(day, "LT").format("HH:mm");
            }
            if (openTime && closeTime && dayOfTheWeek) {
              obj = {
                id: uuidv4(),
                dayOfWeek: dayOfTheWeek,
                openTime: openTime,
                closeTime: closeTime,
                fk_restaurant_id: restaurantId,
              };
              businessHours.push(obj);
            }
          }
        }
      }
      restaurants.push({
        id: restaurantId,
        restaurantName: element.restaurantName.replace(/\s+/g,' ').trim(),
        cashBalance: element.cashBalance,
      });

      for (let mIndex = 0; mIndex < element.menu.length; mIndex++) {
        console.log("Menu Item =====>", mIndex);
        let menuId = uuidv4();
        const item = element.menu[mIndex];
        menus.push({
          id: menuId,
          dishName: item.dishName.replace(/\s+/g,' ').trim(),
          price: item.price,
          fk_restaurant_id: restaurantId,
        });
      }
    }

    const promises = [
      queryInterface.bulkInsert("Restaurants", restaurants),
      queryInterface.bulkInsert("Menus", menus),
      queryInterface.bulkInsert("BusinessHours", businessHours),
    ];
    await Promise.all(promises);
  },

  down: async (queryInterface, Sequelize) => {
    const promises = [
      queryInterface.bulkDelete("Restaurants", null, {}),
      queryInterface.bulkDelete("Menus", null, {}),
      queryInterface.bulkDelete("BusinessHours", null, {}),
    ];
    await Promise.all(promises);
  },
};
