from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import OneHotEncoder
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import hstack

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the dataset
data = pd.read_csv("cuisine_updated.csv")

# Preprocess the data
data['diet_lower'] = data['diet'].str.lower()

# Fit encoders and vectorizers
diet_encoder = OneHotEncoder()
diet_encoded = diet_encoder.fit_transform(data[['diet_lower']])

tfidf_vectorizer = TfidfVectorizer()
ingredients_encoded = tfidf_vectorizer.fit_transform(data['cleaned_ingredients'])

# Combine features
features = hstack([diet_encoded, ingredients_encoded])

# Train the KNN model
knn = NearestNeighbors(n_neighbors=6, metric='cosine')
knn.fit(features)

# Function to find similar recipes
def find_similar_recipes(input_diet, input_ingredients, top_k=5):
    input_diet = input_diet.lower()

    # Encode input diet
    input_diet_encoded = diet_encoder.transform([[input_diet]])

    # Encode input ingredients
    input_ingredients_encoded = tfidf_vectorizer.transform([input_ingredients])

    # Combine diet and ingredients features
    input_features = hstack([input_diet_encoded, input_ingredients_encoded])

    # Find nearest neighbors
    distances, indices = knn.kneighbors(input_features, n_neighbors=top_k)

    # Retrieve top K similar recipes
    similar_recipes = data.iloc[indices[0]]
    return similar_recipes

# Define the Flask route for recipe recommendations
@app.route('/recommend', methods=['POST'])
def recommend():
    request_data = request.get_json()
    input_diet = request_data.get('diet')
    input_ingredients = request_data.get('ingredients')

    if not input_diet or not input_ingredients:
        return jsonify({"error": "Please provide both 'diet' and 'ingredients' fields"}), 400

    try:
        similar_recipes = find_similar_recipes(input_diet, input_ingredients, top_k=5)
        
        # Prepare the response
        recipe_list = []
        for _, recipe in similar_recipes.iterrows():
            recipe_data = {
                'recipe_name': recipe.get('name', 'Unknown'),
                'diet': recipe.get('diet', 'N/A'),
                'cuisine': recipe.get('cuisine', 'N/A'),
                'prep_time': recipe.get('prep_time', 'N/A'),
                'description': recipe.get('description', 'N/A'),
                'course': recipe.get('course', 'N/A'),  # Include course
                'instructions': recipe.get('instructions', 'N/A'),  # Include instructions
                'likes': recipe.get('likes', 'N/A'),  # Assuming you have 'likes' in your dataset
                'image_url': recipe.get('image_url', 'N/A')
            }
            recipe_list.append(recipe_data)

        return jsonify(recipe_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5002)