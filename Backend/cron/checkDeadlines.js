const cron = require("node-cron");
const Goal = require("../models/Goals");
const sendDeadlineMail = require("../utils/sendMail");
const moment = require("moment");

function checkDeadlines() {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Running deadline check...");

    try {
      const today = moment().startOf("day");
      const tomorrow = moment(today).add(1, "day");

      // Goals whose deadline has passed
      const overdueGoals = await Goal.find({
        isCompleted: false,
        deadline: { $lt: today.toDate() },
      }).populate("user");

      // Goals whose deadline is today
      const dueTodayGoals = await Goal.find({
        isCompleted: false,
        deadline: {
          $gte: today.toDate(),
          $lt: tomorrow.toDate(),
        },
      }).populate("user");

      // Send overdue emails
      for (const goal of overdueGoals) {
        if (goal.user?.email) {
          await sendDeadlineMail(
            goal.user.email,
            "Goal Overdue",
            `Your goal "${goal.title}" is overdue. Please complete it soon.`
          );
        }
      }

      // Send due-today emails
      for (const goal of dueTodayGoals) {
        if (goal.user?.email) {
          await sendDeadlineMail(
            goal.user.email,
            "Goal Due Today",
            `Your goal "${goal.title}" is due today. Please complete it.`
          );
        }
      }

      console.log(
        `✅ Emails sent to ${overdueGoals.length + dueTodayGoals.length} users`
      );
    } catch (err) {
      console.error("❌ Error checking deadlines:", err);
    }
  });
}

module.exports = checkDeadlines;
