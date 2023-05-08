module.exports = (sequelize, DataTypes) => {
  const Attachments= sequelize.define(
    "attachment",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      freezeTableName: true
    }
  );
  Attachments.associate = function (models) {
    // associations can be defined here
    Attachments.belongsTo(models.task);
  };
  return Attachments;
};
