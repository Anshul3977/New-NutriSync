// src/components/ProgressCharts.jsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import './ProgressCharts.css';

const ProgressCharts = ({ progressData, goals }) => {
  const weightData = progressData.weight || [];
  const calorieData = progressData.calories || [];

  return (
    <div className="progress-charts-container">
      <h3>Your Progress</h3>

      {/* Weight Progress Chart */}
      <div className="chart-section">
        <h4>Weight Progress</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weightData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Calorie Intake Chart */}
      <div className="chart-section">
        <h4>Calorie Intake</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={calorieData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Calories', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="caloriesConsumed" stroke="#82ca9d" />
            <Line
              type="monotone"
              dataKey={() => goals.calorieGoal}
              stroke="#ff7300"
              strokeDasharray="5 5"
              name="Calorie Goal"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Additional charts for macronutrients can be added here */}
    </div>
  );
};

export default ProgressCharts;