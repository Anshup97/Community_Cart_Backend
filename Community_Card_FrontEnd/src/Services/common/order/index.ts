
import { CreateOrderSchema } from "@/model/Order";
import axios from "axios";
import Cookies from "js-cookie";

export const create_a_new_order = async (formData: CreateOrderSchema) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/placeOrder`, JSON.stringify(formData), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      }
    });

    return res;
  } catch (error) {
    throw new Error('Error in creating Order (service) =>'+ error);
  }
}



export const get_customer_orders = async (customerId: number) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/getOrders`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      params: { customerId }
    });

    return res;
  } catch (error) {
    console.log('Error in getting all orders (service) =>', error)
  }
}


export const get_order_details= async (orderId: number) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/getOrderById`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      params: { orderId }
    });
  
    return res;
  } catch (error) {
    console.log('Error in getting all orders Item for specific User (service) =>', error)
  }
}