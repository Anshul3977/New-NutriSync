// src/components/Reminders.jsx
import React, { useEffect, useState } from 'react';
import './Reminders.css';

const Reminders = ({ goals }) => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    // Logic to generate reminders based on goals
    const newReminders = [];

    if (goals.fitnessGoal) {
      newReminders.push("Don't forget your workout today!");
    }

    // Add more reminders as needed

    setReminders(newReminders);
  }, [goals]);

  return (
    <div className="reminders-container">
      <h3>Reminders</h3>
      {reminders.length > 0 ? (
        <ul>
          {reminders.map((reminder, index) => (
            <li key={index}>• {reminder}</li>
          ))}
        </ul>
      ) : (
        <p>No reminders at the moment.</p>
      )}
    </div>
  );
};

export default Reminders;