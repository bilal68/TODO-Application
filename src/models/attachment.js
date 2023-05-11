module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define(
    "attachment",
    {
      original_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );
  Attachment.associate = function (models) {
    // associations can be defined here
    Attachment.belongsTo(models.task, {
      foreignKey: "fk_task_id",
      as: "Task",
      onDelete: 'CASCADE',
    });
  };
  return Attachment;
};
