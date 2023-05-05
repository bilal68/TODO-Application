module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
      }
    },
    {
      timestamps: false,
      freezeTableName: true
    }
  );
  // Users.associate = function (models) {
  //   // associations can be defined here
  //   Users.hasMany(models.PurchaseHistory, {
  //     foreignKey: "fk_user_id",
  //     as: "PurchaseHistory",
  //   });
  // };
  return Users;
};
