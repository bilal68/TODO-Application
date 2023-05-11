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
        defaultValue: null,
      },
      completion_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      as: "Attachments",
      onDelete: 'CASCADE',
      hooks: true, 
    });
    Task.belongsTo(models.user, {
      foreignKey: 'fk_user_id',
      as: 'User',
    });
    
  };

  return Task;
};
