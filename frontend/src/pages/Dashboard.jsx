import React, { useEffect, useState } from "react";
import axios from "axios";
import WeeklyBarChart from "../components/WeeklyBarChart";
import moment from "moment";

function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [weeklyData, setWeeklyData] = useState([]);

  //New states for editing
  const [editGoalId, setEditGoalId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/goals", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setGoals(res.data);
      } catch (err) {
        console.log("Error in FetchGoals :", err);
      }
    };
    fetchGoals();
  }, []);

  /* Handles Add goals */
  const handleAddGoal = async (e) => {
    e.preventDefault();

    try {
      /* This sends data to backend */
      const res = await axios.post(
        "http://localhost:5000/goals",
        {
          /*JWT token in the headers to tell the backend: “I’m logged in!” */
          title,
          description,
          deadline,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setGoals([...goals, res.data]); // add new goal to list
      setTitle("");
      setDescription("");
      setDeadline("");
    } catch (err) {
      console.log("Error in Adding goals", err);
    }
  };

  // Delete Goals

  const handleDelete = async (id) => {
    console.log("Deleting Goal Id :", id); //Check this
    try {
      const deleteGoal = await axios.delete(
        `http://localhost:5000/goals/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setGoals(goals.filter((goal) => goal._id !== id));
    } catch (err) {
      console.log("Error in deleting Goal :", err);
    }
  };

  const startEditing = (goal) => {
    setEditGoalId(goal._id);
    setEditTitle(goal.title);
    setEditDescription(goal.description);
    setEditDeadline(goal.deadline.split("T")[0]);
  };

  const handleEditGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/goals/${editGoalId}`,
        {
          title: editTitle,
          description: editDescription,
          deadline: editDeadline,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update goals in UI
      const updateGoals = goals.map((goal) =>
        goal._id === editGoalId ? res.data : goal
      );

      setGoals(updateGoals);
      setEditGoalId(null);
      setEditTitle("");
      setEditDescription("");
      setEditDeadline("");
    } catch (err) {
      console.log("Error in handleEditGoals :", err);
    }
  };

  const handleMarkAsCompleted = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/goals/${id}`,
        { isCompleted: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setGoals(goals.map((goal) => (goal._id === id ? res.data : goal)));
    } catch (err) {
      console.log("Error in handleMarkAsCompleted", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); //remove the JWT token
    alert("Logged out SuccessFully");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/goals/weekly-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("Weekly completed goals:", data);
        console.log("Weekly Data in Dashboard:", weeklyData);

        setWeeklyData(data);
      } catch (error) {
        console.error("Error fetching weekly data", error);
      }
    };

    fetchWeeklyData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fefbf6]">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-[#fdf6e3] p-5 shadow-md">
        <h2 className="text-2xl font-bold mb-8">GoalSphere</h2>

        <div className="mb-6">
          <p className="text-gray-600">Total Goals</p>
          <p className="text-3xl font-semibold">{goals.length}</p>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">Goals Completed</p>
          <p className="text-3xl font-semibold">
            {goals.filter((goal) => goal.isCompleted).length}
          </p>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">Active Goals</p>
          <p className="text-3xl font-semibold">
            {goals.filter((goal) => !goal.isCompleted).length}
          </p>
        </div>

        {/* Placeholder for chart */}
        <div>
          <p className="text-gray-600 mb-2">Goals Completed per Week</p>
          <div className="h-80 bg-blue-200 rounded-lg mt-4">
            <WeeklyBarChart weeklyData={weeklyData} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full md:flex-1 p-4 sm:p-6 md:p-10 relative">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        {/* Logout Button */}
        <button
          className="border border-black-600 bg-gray-200 text-black px-4 py-2 rounded-xl hover:bg-gray-300 fixed top-4 right-4 z-50"
          onClick={handleLogout}
        >
          Logout
        </button>

        {/* Goals Form */}

        <div>
          <form
            className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6 space-y-4"
            onSubmit={handleAddGoal}
          >
            <input
              className="w-full border border-gray-300 p-2 rounded"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className="w-full border border-gray-300 p-2 rounded"
              type="date"
              placeholder="Deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              type="submit"
            >
              Add Goal
            </button>
          </form>
        </div>

        {/* Goal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Goal Card */}

          {goals.map((goal) =>
            editGoalId === goal._id ? (
              <form
                key={goal._id}
                onSubmit={handleEditGoal}
                className="bg-white p-6 rounded-xl shadow space-y-4"
              >
                <input
                  className="w-full border border-gray-300 p-2 rounded"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="w-full border border-gray-300 p-2 rounded"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <input
                  className="w-full border border-gray-300 p-2 rounded"
                  type="date"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditGoalId(null)}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div
                key={goal._id}
                className={` ${
                  goal.isCompleted
                    ? "shadow-lg shadow-green-500/10"
                    : "shadow-lg shadow-blue-500/10"
                } bg-white p-6 rounded-xl shadow relative`}
              >
                {/* ${goal.isCompleted ? 'border border-green-500' : 'border border-blue-300'} */}
                <h2 className="text-xl font-bold mb-2">{goal.title}</h2>

                <p className="text-gray-600 mb-3 mt-5">{goal.description}</p>
                <div className="h-3 bg-green-100 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${
                      goal.isCompleted
                        ? "w-full bg-green-500"
                        : "w-0 bg-gray-400"
                    } transition-all duration-500`}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {goal.isCompleted ? "100% Completed" : "0% Completed"}
                </p>
                <p className="text-xs text-gray-500 absolute right-4 bottom-2">
                  📅
                  {new Date(goal.deadline).toLocaleDateString("en-GB", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                <div className="flex flex-wrap gap-2 mt-4 mb-5">
                  {/* Edit Button */}
                  <button
                    className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700 transition "
                    onClick={() => startEditing(goal)}
                  >
                    Edit
                  </button>
                  {/* Mark as Complete Button */}

                  <button
                    className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition"
                    onClick={() => handleMarkAsCompleted(goal._id)}
                  >
                    Done
                  </button>

                  {/* Delete Button */}
                  <button
                    className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700 transition"
                    onClick={() => handleDelete(goal._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}

          {/* Repeat more goal cards */}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
