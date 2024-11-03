const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

let reviews = [];

// Endpoint to handle review submission
app.post('/reviews', (req, res) => {
  reviews.push(req.body);
  res.status(201).send('Review added');
});

// Endpoint to get reviews for a specific company and calculate average rating
app.get('/reviews', (req, res) => {
  const query = req.query.query?.toLowerCase();

  // Filter reviews by company name
  const filteredReviews = reviews.filter(r => r.companyName.toLowerCase() === query);

  if (filteredReviews.length === 0) {
    // If no reviews found, return a message
    return res.json({ message: 'No company found' });
  }

  // Calculate the average rating for the company
  const totalRating = filteredReviews.reduce((acc, review) => acc + parseFloat(review.rating), 0);
  const averageRating = (totalRating / filteredReviews.length).toFixed(1);

  // Send the filtered reviews and average rating
  res.json({
    averageRating,
    reviews: filteredReviews
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
