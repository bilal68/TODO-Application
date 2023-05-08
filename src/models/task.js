module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "task",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT("medium"),
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATE,
      },
      completion_date: {
        type: DataTypes.DATE,
      },
      completion_status: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );
  Task.associate = function (models) {
    // associations can be defined here
    Task.hasMany(models.attachment, {
      foreignKey: "fk_task_id",
      as: "Task",
    });
    Task.belongsTo(models.user);
  };

  return Task;
};
