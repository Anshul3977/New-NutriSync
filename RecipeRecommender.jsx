import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';

const RecipeRecommender = () => {
  const [formData, setFormData] = useState({
    protein: '',
    carbohydrates: '',
    fat: '',
    fiber: '',
    ingredients: '',
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation for form data
    if (!formData.protein || !formData.carbohydrates || !formData.fat || !formData.fiber || !formData.ingredients) {
      setError('All fields must be filled out');
      setLoading(false);
      return;
    }

    fetch('http://127.0.0.1:5000/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setRecommendations(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching recommendations:', error);
        setError('Failed to fetch recommendations. Please try again later.');
        setLoading(false);
      });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Recipe Recommender
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Protein level (high, medium, low)"
                name="protein"
                value={formData.protein}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Carbohydrates level (high, medium, low)"
                name="carbohydrates"
                value={formData.carbohydrates}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fat level (high, medium, low)"
                name="fat"
                value={formData.fat}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fiber level (high, medium, low)"
                name="fiber"
                value={formData.fiber}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ingredients (comma-separated)"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Button variant="contained" color="primary" type="submit" size="large" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Get Recommendations'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Recommended Recipes:
        </Typography>
        <div>
          {loading ? (
            <CircularProgress />
          ) : recommendations.length > 0 ? (
            recommendations.map((recipe, index) => (
              <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    {recipe.image_url && <img src={recipe.image_url} alt={recipe.recipe_name} width="100%" />}
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h6">{recipe.recipe_name}</Typography>
                    <Typography>Ingredients: {recipe.ingredients_list}</Typography>
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Calories</TableCell>
                            <TableCell>Protein</TableCell>
                            <TableCell>Carbohydrates</TableCell>
                            <TableCell>Fat</TableCell>
                            <TableCell>Fiber</TableCell>
                            <TableCell>Cholesterol</TableCell>
                            <TableCell>Sodium</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>{recipe.calories}</TableCell>
                            <TableCell>{recipe.protein}g</TableCell>
                            <TableCell>{recipe.carbohydrates}g</TableCell>
                            <TableCell>{recipe.fat}g</TableCell>
                            <TableCell>{recipe.fiber}g</TableCell>
                            <TableCell>{recipe.cholesterol}mg</TableCell>
                            <TableCell>{recipe.sodium}mg</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Paper>
            ))
          ) : (
            <Typography>No recommendations yet.</Typography>
          )}
        </div>
      </Box>
    </Container>
  );
};

export default RecipeRecommender;