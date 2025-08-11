import moment from "moment"; // if you're already using moment

function GoalCard() {


const today = moment().startOf('day');
const deadline = moment(goal.deadline).startOf('day'); // assuming goal.deadline is a date string

let deadlineStatus = "";
if (deadline.isBefore(today)) {
  deadlineStatus = "overdue";
} else if (deadline.isSame(today)) {
  deadlineStatus = "due-today";
} else {
  deadlineStatus = "upcoming";
}

return (
    <div
  className={`rounded-xl p-4 shadow-md ${
    deadlineStatus === "overdue"
      ? "border-2 border-red-500"
      : deadlineStatus === "due-today"
      ? "border-2 border-yellow-500"
      : "border"
  }`}
></div>

);

}

