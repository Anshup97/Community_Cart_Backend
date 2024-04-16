import { AddReview } from "@/model/Review";
import axios from "axios";
import Cookies from "js-cookie";

export const add_or_edit_review = async (review: AddReview) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/review/postReview`, JSON.stringify(review), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      }
    });

    return res;
  } catch (error) {
    throw new Error('Error in Add product to cart (service) =>' + error);
  }
}

export const get_can_review = async (customerId: number, productId: number) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/review/canReview`, {
      params: { customerId, productId }
    });

    return res;
  } catch (error) {
    throw new Error('Error in getting all cart Item for specific User (service) =>' + error)
  }
}

export const get_reviews_by_product_id = async (productId: number) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/review/getReviews`, {
      params: { productId }
    });

    return res;
  } catch (error) {
    throw new Error('Error in getting all cart Item for specific User (service) =>' + error)
  }
}

export const delete_review = async (customerId: number, productId?: number) => {
  try {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/review/removeCart`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      params: productId ? { customerId, productId } : { customerId }
    })

    return res;
  } catch (error) {
    throw new Error('Error in deleting cart items (service) =>' + error)
  }
}



