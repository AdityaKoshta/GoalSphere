import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const WEEK_DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const dayToShort = {
  Sunday: "sun",
  Monday: "mon",
  Tuesday: "tue",
  Wednesday: "wed",
  Thursday: "thu",
  Friday: "fri",
  Saturday: "sat",
};

const WeeklyBarChart = ({ weeklyData }) => {
  const normalizedData = weeklyData.map((d) => ({
    day: dayToShort[d.day] || d.day.toLowerCase(),
    count: d.count,
  }));

  const fullWeekData = WEEK_DAYS.map((day) => {
    const dayData = normalizedData.find((d) => d.day === day);
    return {
      day,
      count: dayData ? dayData.count : 0,
    };
  });

  const total = fullWeekData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="w-full max-w-3xl mx-auto bg-blue-100 rounded-xl p-4 sm:p-6">
      <h2 className="text-center text-base sm:text-lg md:text-xl font-bold mb-4">
        Goals Completed per Week
      </h2>
      {total === 0 ? (
        <p className="text-center text-gray-500 text-sm sm:text-base">
          No goals completed this week.
        </p>
      ) : (
        <div className="w-full h-60 sm:h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fullWeekData}>
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default WeeklyBarChart;
