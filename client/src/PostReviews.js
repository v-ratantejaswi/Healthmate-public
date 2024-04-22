import React from 'react';
import "./PostReviews.css";


const PostReviews = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return (
          <div>
            <h3>No reviews yet.</h3>
          </div>
        );
      }
return (
<div class="reviews">
<div style={{ textAlign: "center" }}>
  <br></br>
  <br></br>
  <br></br>
<h3>Reviews and Ratings</h3></div>
  {reviews.map((review, index) => (
    <div class="review-container" key={index}>
      <p>Reviewer: {review.fullName} </p>
      <p>Email: {review.email}</p>
      <p>Review: {review.review}</p>
      <p>Rating: {review.rating}</p>
    </div>
  ))}
</div>
);
};

export default PostReviews;