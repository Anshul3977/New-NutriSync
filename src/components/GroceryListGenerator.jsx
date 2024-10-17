// src/components/GroceryListGenerator.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroceryListGenerator = ({ mealPlan }) => {
    const [groceryList, setGroceryList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (mealPlan) {
            fetchGroceryList();
        }
    }, [mealPlan]);

    const fetchGroceryList = async () => {
        setLoading(true);
        setError(null);
        try {
            // Assume we have a function to extract ingredients from mealPlan
            const ingredients = extractIngredients(mealPlan);
            const response = await axios.post('https://api.spoonacular.com/mealplanner/grocery-list', {
                ingredients: ingredients,
                apiKey: 'your-api-key-here', // Replace with your actual API key
            });
            setGroceryList(response.data.ingredients);
        } catch (err) {
            console.error('Error fetching grocery list:', err);
            setError('Failed to load grocery list.');
        } finally {
            setLoading(false);
        }
    };

    const extractIngredients = (mealPlan) => {
        const ingredients = [];
        if (mealPlan.week) {
            Object.keys(mealPlan.week).forEach((day) => {
                mealPlan.week[day].meals.forEach((meal) => {
                    if (meal.extendedIngredients) {
                        meal.extendedIngredients.forEach((ingredient) => {
                            ingredients.push(ingredient.name); // or ingredient.original for full ingredient string
                        });
                    }
                });
            });
        }
        return ingredients;
    };

    if (loading) {
        return <div>Loading grocery list...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (groceryList.length === 0) {
        return <div>No ingredients available. Please generate a meal plan first.</div>;
    }

    return (
        <div>
            <h2>Grocery List</h2>
            <ul>
                {groceryList.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default GroceryListGenerator;