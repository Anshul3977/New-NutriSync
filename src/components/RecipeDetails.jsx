import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import './RecipeDetails.css'; // Import the custom CSS for any additional custom styling

const RecipeDetails = () => {
  const location = useLocation();
  const recipe = location.state?.recipe;

  if (!recipe) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No recipe details available.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card className="recipe-card">
        <CardMedia
          component="img"
          image={recipe.image_url}
          alt={recipe.recipe_name}
          className="recipe-image"
        />
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom className="recipe-title">
            {recipe.recipe_name}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Grid container spacing={1}>
              <Grid item>
                <Chip label={recipe.diet} color="primary" variant="outlined" />
              </Grid>
              <Grid item>
                <Chip label={recipe.cuisine} color="secondary" variant="outlined" />
              </Grid>
              <Grid item>
                <Chip label={`Course: ${recipe.course}`} color="success" variant="outlined" />
              </Grid>
              <Grid item>
                <Chip label={`Prep Time: ${recipe.prep_time}`} color="info" variant="outlined" />
              </Grid>
              <Grid item>
                <Chip label={`Likes: ${recipe.likes}`} color="warning" variant="outlined" />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h5" component="h2" gutterBottom className="recipe-section-title">
            Description
          </Typography>
          <Typography variant="body1" paragraph className="recipe-description">
            {recipe.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h5" component="h2" gutterBottom className="recipe-section-title">
            Instructions
          </Typography>
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'pre-line' }}
            className="recipe-instructions"
          >
            {recipe.instructions ? recipe.instructions : 'No instructions provided.'}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecipeDetails;
