import { Model, DataTypes } from "sequelize";
// const bcrypt = require("bcrypt");

class User extends Model {
//   constructor() {
//     super(...arguments);
//   }
  static init(sequelize) {
    return super.init(
      {
        first_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: { type: DataTypes.STRING },
        verification_code: {
          type: DataTypes.STRING,
        },
        is_verified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        modelName: "User",
      }
    );

    // this.addHook("beforeSave", async (user) => {
    //   if (user.changed("password")) {
    //     const salt = await bcrypt.genSalt(10);
    //     user.password = await bcrypt.hash(user.password, salt);
    //   }
    // });
  }

  static associate(models) {
    // User.hasMany(models.task, {
    //   foreignKey: "fk_user_id",
    //   as: "task",
    // });
  }

  static async createUser(userData) {
    const user = await User.create(userData);
    return user.toJSON();
  }

  static async updateUser(id, userData) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }

    await user.update(userData);

    return user.toJSON();
  }

  static async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }

    await user.destroy();
  }

  static async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      throw new Error("User not found");
    }

    return user.toJSON();
  }

  static async getUserByEmail(email) {
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      throw new Error("User not found");
    }

    return user.toJSON();
  }
}

module.exports = User;