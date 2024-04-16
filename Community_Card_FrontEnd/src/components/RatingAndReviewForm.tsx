import { add_or_edit_review, get_can_review } from '@/Services/common/review';
import React, { useState, useEffect } from 'react';
import Reviews from './Reviews';
import Loading from '@/components/loading';

const RatingAndReviewForm = ({ customerId, productId }: { customerId?: number, productId: number }) => {
  const [rating, setRating] = useState(0);
  const [canReview, setCanReview] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const get_review_eligibility = async () => {
      if (!customerId) {
        setCanReview(false);
        return;
      }
      const res = await get_can_review(customerId, productId);
      if (res.status === 200) {
        if (res.data === true) {
          setCanReview(true);
        } else {
          setCanReview(false);
        }
      } else {
        setCanReview(false);
      }
    }
    get_review_eligibility();
  }, []);

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleTextChange = (e: any) => {
    setReviewText(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!customerId) return;

    setLoading(true);
    // Use the rating and reviewText as needed (e.g., submit to a server, update state, etc.)
    console.log('Rated:', rating);
    console.log('Review:', reviewText);
    await add_or_edit_review({
      customerId,
      productId,
      rating,
      review: reviewText
    })
    setLoading(false);

    // Optionally, you can reset the state after submission
    setRating(0);
    setReviewText('');
  };
  if (canReview) {
    return (
      <div className='w-full'>
        <div>
          <div>
            <h3>Your Rating:</h3>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <span
                  key={value}
                  onClick={() => handleStarClick(value)}
                  style={{ cursor: 'pointer', color: value <= rating ? 'gold' : 'gray' }}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Write a review:
            <textarea className='w-full' value={reviewText} onChange={handleTextChange} />
          </label>
          <button className='btn' type="submit">Submit Review</button>
        </form>
        {
          loading ? <Loading /> :
            <Reviews productId={productId} />
        }
      </div>
    );
  } else {
    return (
      <div className='p-5'>
        Please purchase this product to rate or review.
        <Reviews productId={productId} />
      </div>
    )
  }
}

export default RatingAndReviewForm;
