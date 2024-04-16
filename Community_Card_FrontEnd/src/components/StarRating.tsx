import React from 'react';

const StarRating = ({ rating }: { rating: number }) => {
  const maxStars = 5; // Assuming a maximum of 5 stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i}>&#9733;</span>); // Unicode star character
    }

    if (hasHalfStar) {
      stars.push(<span key="half">&#9734;&#9733;</span>); // Unicode star and half-star characters
    }

    const remainingStars = maxStars - stars.length;

    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={i + fullStars}>&#9734;</span>); // Unicode empty star character
    }

    return stars;
  };

  return <div className="star-rating">{renderStars()}</div>;
};

export default StarRating;
