

import { AddToCartSchema, CartItem, CartViewSchema } from "@/model/Cart";
import axios from "axios";
import Cookies from "js-cookie";

export const add_to_cart = async (product: AddToCartSchema, customerId: number) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/addtocart`, JSON.stringify(product), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      params:{
        customerId
      }
    });

    return res;
  } catch (error) {
    throw new Error('Error in Add product to cart (service) =>' + error);
  }
}

export const checkout_cart = async (customerId: number) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/checkout`, null, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      params: { customerId }
    });
    
    return res;
  } catch (error) {
    throw new Error('Error in creating Order (service) =>'+ error);
  }
}

export const get_all_cart_Items = async (customerId: number) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/viewcart`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      params: { customerId }
    });

    return res;
  } catch (error) {
    throw new Error('Error in getting all cart Item for specific User (service) =>' + error)
  }
}

export const update_cart = async (customerId: number, cartItems: CartItem[]) => {
  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/updateCart`, JSON.stringify(cartItems), {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
        "Content-Type": "application/json"
      },

      params: { customerId }
    });

    return res;
  } catch (error) {
    throw new Error('Error in getting all cart Item for specific User (service) =>' + error)
  }
}


export const delete_a_cart_item = async (customerId: number, productId?: number) => {
  try {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/removeCart`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      params: productId ? { customerId, productId } : { customerId }
    })

    return res;
  } catch (error) {
    throw new Error('Error in deleting cart items (service) =>'+ error)
  }
}



