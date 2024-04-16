

import { UpdateOrderSchema } from "@/model/Order";
import axios from "axios";
import Cookies from "js-cookie";


export const get_all_orders = async (sellerId: number) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/getOrders`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      params: { sellerId }
    });

    return res;
  } catch (error) {
    console.log('Error in getting all orders (service) =>', error)
  }
}



export const update_order_status = async (data: UpdateOrderSchema) => {
  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/updateOrder`, JSON.stringify(data), {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'application/json'
      }
    })

    return res;
  } catch (error) {
    console.log('Error in updating order status (service) =>', error)
  }
}

export const cancel_order = async (orderId: number) => {
  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/order/cancelOrder`, null, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'application/json'
      },
      params: {
        orderId
      }
    })

    return res;
  } catch (error) {
    console.log('Error in updating order status (service) =>', error)
  }
}

