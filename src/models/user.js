module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
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
      timestamps: true,
      freezeTableName: true,
    }
  );
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.task, {
      foreignKey: "fk_user_id",
      as: "task",
    });
  };
  return User;
};
