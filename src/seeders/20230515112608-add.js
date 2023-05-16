const Chance = require("chance");
const chance = new Chance();

const generateRandomTasks = () => {
  const tasks = [];

  for (let i = 1; i <= 100; i++) {
    const isCompleted = chance.bool();
    const dueDate = chance.date({ year: 2023 });
    const completionDate = isCompleted ? chance.date({ year: 2023 }) : null;

    const task = {
      title: chance.sentence({ words: 3 }),
      description: chance.paragraph(),
      due_date: dueDate,
      completion_date: completionDate,
      completion_status: isCompleted,
      createdAt: new Date(),
      updatedAt: new Date(),
      fk_user_id: 3,
    };

    tasks.push(task);
  }

  return tasks;
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tasks = generateRandomTasks();
    await queryInterface.bulkInsert("task", tasks, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("task", null, {});
  },
};
