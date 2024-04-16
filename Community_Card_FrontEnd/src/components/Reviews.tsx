import { get_reviews_by_product_id } from '@/Services/common/review';
import { Review } from '@/model/Review';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import StarRating from './StarRating';

const Reviews = ({ productId }: { productId?: number }) => {
    const [reviews, setReviews] = useState<Review[]>([])
    useEffect(() => {
        const getReviews = async () => {
            if (productId) {
                const res = await get_reviews_by_product_id(productId);
                if (res.status === 200 && res.data) {
                    setReviews(res.data);
                } else if (res.status !== 200) {
                    toast.error("Unable to get reviews");
                }
            }
        }

        getReviews();
    }, [])
    // Function to render individual reviews
    const renderReviews = () => {
        return reviews.map((review: Review, index: number) => (
            <div key={index} className='bg-gray-200 my-2 p-5 w-full shadow-xl'>
                <StarRating rating={review.rating} />
                <p>{review.review}</p>
            </div>
        ));
    };

    return (
        <div>
            <h3 className='my-4'>Reviews:</h3>
            {reviews.length > 0 ? renderReviews() : <p>No reviews yet.</p>}
        </div>
    );
};

export default Reviews;
