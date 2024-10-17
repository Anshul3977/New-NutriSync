from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer

app = Flask(__name__)
CORS(app)

# Load the dataset
file_path = 'recipe_final(1).csv'
recipe_df = pd.read_csv(file_path)

# Macronutrient mapping based on levels (high, medium, low)
macronutrient_mapping = {
    'protein': {'high': (25, 30), 'medium': (15, 20), 'low': (0, 10)},
    'carbohydrates': {'high': (50, 75), 'medium': (30, 45), 'low': (0, 20)},
    'fat': {'high': (20, 30), 'medium': (10, 15), 'low': (0, 5)},
    'fiber': {'high': (10, 15), 'medium': (5, 10), 'low': (0, 5)}
}

# Function to map macronutrient input levels to numerical values
def map_macronutrient_input(nutrient_type, level):
    low, high = macronutrient_mapping[nutrient_type][level]
    return (low + high) / 2  # Average value of the range

# Preprocess ingredients using TF-IDF
vectorizer = TfidfVectorizer()
X_ingredients = vectorizer.fit_transform(recipe_df['ingredients_list'])

# Normalize numerical features (like calories, fat, etc.)
scaler = StandardScaler()
X_numerical = scaler.fit_transform(recipe_df[['calories', 'fat', 'carbohydrates', 'protein', 'cholesterol', 'sodium', 'fiber']])

# Combine normalized numerical features and processed ingredients
X_combined = np.hstack([X_numerical, X_ingredients.toarray()])

# Train a K-Nearest Neighbors (KNN) model
knn = NearestNeighbors(n_neighbors=3, metric='euclidean')
knn.fit(X_combined)

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    
    protein_level = data.get('protein')
    carbs_level = data.get('carbohydrates')
    fat_level = data.get('fat')
    fiber_level = data.get('fiber')
    ingredients = data.get('ingredients')

    # Map macronutrient inputs
    input_macronutrients = {
        'protein': map_macronutrient_input('protein', protein_level),
        'carbohydrates': map_macronutrient_input('carbohydrates', carbs_level),
        'fat': map_macronutrient_input('fat', fat_level),
        'fiber': map_macronutrient_input('fiber', fiber_level)
    }

    # Default input values for numerical features
    input_numerical = [
        200,  # Default 200 calories
        input_macronutrients['fat'],
        input_macronutrients['carbohydrates'],
        input_macronutrients['protein'],
        50,  # Default cholesterol value (50mg)
        500,  # Default sodium value (500mg)
        input_macronutrients['fiber']
    ]

    # Normalize and combine the input
    input_features_scaled = scaler.transform([input_numerical])
    input_ingredients_transformed = vectorizer.transform([ingredients])
    input_combined = np.hstack([input_features_scaled, input_ingredients_transformed.toarray()])

    # Get the nearest recipe recommendations
    distances, indices = knn.kneighbors(input_combined)
    recommendations = recipe_df.iloc[indices[0]]

    # Prepare the recommendations in a structured format, including nutritional data
    recipe_list = []
    for _, recipe in recommendations.iterrows():
        recipe_data = {
            'recipe_name': recipe['recipe_name'],
            'ingredients_list': recipe['ingredients_list'],
            'image_url': recipe['image_url'],
            'calories': recipe['calories'],  # Include calories
            'fat': recipe['fat'],  # Include fat
            'carbohydrates': recipe['carbohydrates'],  # Include carbohydrates
            'protein': recipe['protein'],  # Include protein
            'cholesterol': recipe['cholesterol'],  # Include cholesterol
            'sodium': recipe['sodium'],  # Include sodium
            'fiber': recipe['fiber']  # Include fiber
        }
        recipe_list.append(recipe_data)

    return jsonify(recipe_list)

if __name__ == '__main__':
    app.run(debug=True)