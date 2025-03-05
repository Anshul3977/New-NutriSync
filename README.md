
# NutriSync

**NutriSync** is an AI-powered, smart meal planning and nutrition management platform designed to make healthy eating effortless. By leveraging machine learning for personalized recipe recommendations and incorporating modern web technologies, NutriSync helps you manage dietary preferences, track nutritional intake, generate grocery lists, and achieve your health goals—all in one place.

## Features

- **Personalized Recipe Recommendations**  
  Uses advanced NLP (TF-IDF, Nearest Neighbors) to suggest recipes tailored to your dietary preferences, available ingredients, and foods to avoid.
  
- **Health Goals Tracker**  
  Set and monitor health goals such as target weight, calorie intake, and macronutrient breakdown (protein, carbs, fats) with interactive progress charts and dashboards.

- **Meal Planning & Grocery List Generator**  
  Generate weekly meal plans based on your nutritional goals and create smart grocery lists automatically.

- **Decentralized Nutrition Tracking (Future Enhancement)**  
  Explore blockchain-based data integrity and secure user data storage for nutrition tracking.

- **Community-Driven Insights**  
  Engage with a community of food enthusiasts, share feedback, and earn tokenized rewards for contributions.

## Tech Stack

- **Frontend:** React, React Router, CSS (custom styles)
- **Backend:** Flask, Python, Flask-CORS
- **Machine Learning:** scikit-learn (TF-IDF, Nearest Neighbors)
- **Data:** CSV datasets for recipes (e.g., `cuisine_updated.csv`, `recipe_dataset_clean.csv`)
- **Additional Tools:** Axios for API calls, JWT for authentication (if applicable)

## Installation

### Prerequisites
- Node.js & npm/yarn
- Python 3.x
- MongoDB (if you're using it for user profiles)

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Anshul3977/New-NutriSync.git
   cd New-NutriSync
   ```

2. Navigate to the frontend directory (if separated) and install dependencies:
   ```bash
   cd frontend
   npm install
   # or yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or yarn start
   ```

### Backend Setup

1. Navigate to the backend directory (if separated) and install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Make sure your dataset files (e.g., `cuisine_updated.csv`, `recipe_dataset_clean.csv`) are in place.

3. Start the Flask server:
   ```bash
   python app.py
   ```

## Usage

- **User Signup & Login:**  
  Create a new account or log in with your credentials. Upon login, you can set your dietary preferences, allergies, and health goals.

- **Recipe Recommendations:**  
  Use the search and multi-step form to get personalized recipe recommendations. Click on "See More" to view detailed recipe instructions and nutritional information.

- **Meal Planning & Tracking:**  
  Set health goals, track your progress via interactive charts, and receive meal planning suggestions that align with your nutritional targets.

## Testing the API with Postman

1. **Test the Profile API:**  
   Use a GET request to `http://127.0.0.1:5002/api/get-profile` with the proper Authorization header (`Bearer <your_token>`).

2. **Test Recipe Recommendation API:**  
   Send a POST request to `http://127.0.0.1:5002/recommend` with a JSON body, for example:
   ```json
   {
     "diet": "High Protein Non-Vegetarian",
     "ingredients": "chicken, eggs, beef",
     "foods_to_avoid": "peanuts, soy"
   }
   ```

## Contributing

Contributions are welcome! If you'd like to improve NutriSync:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).
