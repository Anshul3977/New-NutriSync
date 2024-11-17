// src/components/GoalsTracker.jsx
import React, { useState, useEffect } from 'react';
import GoalSettingForm from './GoalSettingForm';
import ProgressCharts from './ProgressCharts';
import NutrientDashboard from './NutrientDashboard';
import MealPlanSuggestions from './MealPlanSuggestions';
import MotivationalTips from './MotivationalTips';
import Reminders from './Reminders';
import './GoalsTracker.css';

const GoalsTracker = () => {
  const [goals, setGoals] = useState({});
  const [progressData, setProgressData] = useState({
    weight: [],
    calories: [],
  });
  const [nutrientIntake, setNutrientIntake] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  // Load goals from local storage or backend
  useEffect(() => {
    const storedGoals = JSON.parse(localStorage.getItem('userGoals')) || {};
    setGoals(storedGoals);
  }, []);

  // Save goals to local storage when they change
  useEffect(() => {
    localStorage.setItem('userGoals', JSON.stringify(goals));
  }, [goals]);

  // Load progress data from local storage or backend
  useEffect(() => {
    const storedProgressData = JSON.parse(localStorage.getItem('progressData')) || {
      weight: [],
      calories: [],
    };
    setProgressData(storedProgressData);
  }, []);

  // Save progress data when it changes
  useEffect(() => {
    localStorage.setItem('progressData', JSON.stringify(progressData));
  }, [progressData]);

  return (
    <div className="goals-tracker-container">
      <h2>Health & Fitness Goals Tracker</h2>
      <GoalSettingForm setGoals={setGoals} />
      {goals.weightGoal && (
        <>
          <ProgressCharts progressData={progressData} goals={goals} />
          <NutrientDashboard nutrientIntake={nutrientIntake} goals={goals} />
          <MealPlanSuggestions goals={goals} />
          <MotivationalTips progressData={progressData} />
          <Reminders goals={goals} />
        </>
      )}
    </div>
  );
};

export default GoalsTracker;