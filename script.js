document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const starRating = document.getElementById('starRating');
    const ratingInput = document.getElementById('rating');
    const reviewList = document.getElementById('reviewList');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('searchButton');
    const averageRatingDisplay = document.getElementById('averageRating');
  
    // Handle star rating click
    starRating.addEventListener('click', (e) => {
      if (e.target.dataset.value) {
        const selectedRating = parseInt(e.target.dataset.value);
        ratingInput.value = selectedRating;
        updateStarRating(selectedRating);
      }
    });
  
    // Update star rating display based on selected value
    function updateStarRating(value) {
      Array.from(starRating.children).forEach((star, index) => {
        star.classList.toggle('selected', index < value);
      });
    }
  
    // Handle form submission to record the review without displaying it
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const reviewData = {
        companyName: document.getElementById('companyName').value,
        pros: document.getElementById('pros').value,
        cons: document.getElementById('cons').value,
        rating: ratingInput.value
      };
  
      await fetch('/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
  
      // Clear form inputs and reset star rating
      reviewForm.reset();
      ratingInput.value = '0';
      updateStarRating(0);
    });
  
    // Handle search button click to load reviews and display average rating
    searchButton.addEventListener('click', loadReviews);
  
    // Load and display reviews with average rating for the searched company
    async function loadReviews() {
      const query = searchInput.value.trim();
      if (!query) return;
  
      const res = await fetch(`/reviews?query=${query}`);
      const data = await res.json();
  
      if (data.message) {
        // Display "No company found" if no matching company is found
        averageRatingDisplay.textContent = data.message;
        reviewList.innerHTML = '';
      } else {
        // Display the average rating at the top
        averageRatingDisplay.textContent = `Average Rating: ${'★'.repeat(Math.round(data.averageRating))} (${data.averageRating}/5)`;
  
        // Display the list of reviews for the company
        reviewList.innerHTML = data.reviews.map(review => `
          <div class="review">
            <p><strong>Pros:</strong> ${review.pros}</p>
            <p><strong>Cons:</strong> ${review.cons}</p>
            <p><strong>Rating:</strong> ${'★'.repeat(review.rating)} (${review.rating}/5)</p>
          </div>
        `).join('');
      }
    }
  });
  