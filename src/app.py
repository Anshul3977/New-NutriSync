from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer

app = Flask(__name__)
CORS(app)  # Allow all origins by default; adjust if needed

# Load the dataset
file_path = 'src/recipe_final(1).csv'
recipe_df = pd.read_csv(file_path)

# Macronutrient mapping for user input
macronutrient_mapping = {
    'protein': {'high': (25, 30), 'medium': (15, 20), 'low': (0, 10)},
    'carbohydrates': {'high': (50, 75), 'medium': (30, 45), 'low': (0, 20)},
    'fat': {'high': (20, 30), 'medium': (10, 15), 'low': (0, 5)},
    'fiber': {'high': (10, 15), 'medium': (5, 10), 'low': (0, 5)}
}

def map_macronutrient_input(nutrient_type, level):
    try:
        low, high = macronutrient_mapping[nutrient_type][level]
        return (low + high) / 2
    except KeyError:
        return 0

vectorizer = TfidfVectorizer()
X_ingredients = vectorizer.fit_transform(recipe_df['ingredients_list'])

scaler = StandardScaler()
X_numerical = scaler.fit_transform(recipe_df[['calories', 'fat', 'carbohydrates', 'protein', 'cholesterol', 'sodium', 'fiber']])
X_combined = np.hstack([X_numerical, X_ingredients.toarray()])

knn = NearestNeighbors(n_neighbors=3, metric='euclidean')
knn.fit(X_combined)

def recommend_recipes(protein_level, carbs_level, fat_level, fiber_level, ingredients):
    input_macronutrients = {
        'protein': map_macronutrient_input('protein', protein_level),
        'carbohydrates': map_macronutrient_input('carbohydrates', carbs_level),
        'fat': map_macronutrient_input('fat', fat_level),
        'fiber': map_macronutrient_input('fiber', fiber_level)
    }
    
    input_numerical = [
        200,
        input_macronutrients['fat'],
        input_macronutrients['carbohydrates'],
        input_macronutrients['protein'],
        50,
        500,
        input_macronutrients['fiber']
    ]
    
    input_features_scaled = scaler.transform([input_numerical])
    input_ingredients_transformed = vectorizer.transform([ingredients])
    input_combined = np.hstack([input_features_scaled, input_ingredients_transformed.toarray()])

    distances, indices = knn.kneighbors(input_combined)
    recommendations = recipe_df.iloc[indices[0]]
    return recommendations[['recipe_name', 'ingredients_list', 'image_url']].to_dict(orient='records')

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    protein_level = data.get('protein', 'medium')
    carbs_level = data.get('carbohydrates', 'medium')
    fat_level = data.get('fat', 'medium')
    fiber_level = data.get('fiber', 'medium')
    ingredients = data.get('ingredients', '')

    if not ingredients:
        return jsonify({"error": "Ingredients input is required"}), 400

    try:
        recommendations = recommend_recipes(protein_level, carbs_level, fat_level, fiber_level, ingredients)
        return jsonify(recommendations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)