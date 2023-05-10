"use strict";

const bcrypt = require("bcrypt");
const { user: User } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash the password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create a new user
    const user = {
      email: "john@example.com",
      password: "123",
      first_name: "John",
      last_name: "Doe",
      is_verified: true,
    };

    // Insert the user into the database
    await User.create(user);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the user from the database
    await User.destroy({ where: { email: "john@example.com" } });
  },
};
