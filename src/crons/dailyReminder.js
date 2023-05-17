import cron from "node-cron";
import { getTodaysTaskList } from "../controllers/task/task.controller";
import { getUserEmail } from "../controllers/user/user.controller";
import { sendEmail } from "../services/email";

cron.schedule("0 0 * * *", () => {
  console.log("running a task every minute");
  sendReminderEmail();
});

async function sendReminderEmail() {
  try {
    const todaysTasks = await getTodaysTaskList();
    if (todaysTasks.length <= 0) {
      console.log("No task due on today!");
      return;
    }

    // Group tasks by user
    const tasksByUser = groupTasksByUser(todaysTasks);

    // Send reminder email to each user with their tasks
    for (const [userId, userTasks] of Object.entries(tasksByUser)) {
      const { email: userEmail } = await getUserEmail(userId); 
      const emailBody = `<pre>${JSON.stringify(userTasks, null, 2)}</pre>`;
      sendEmail(userEmail, "Due Task On Today", emailBody);
    }
  } catch (error) {
    console.error("Error sending reminder email:", error);
  }
}

function groupTasksByUser(tasks) {
  const tasksByUser = {};

  for (const task of tasks) {
    const userId = task.fk_user_id;
    if (userId) {
      if (!tasksByUser[userId]) {
        tasksByUser[userId] = [];
      }
      tasksByUser[userId].push(task);
    }
  }

  return tasksByUser;
}
