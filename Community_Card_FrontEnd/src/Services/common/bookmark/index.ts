
import { BookmarkSchema, CreateBookmarkSchema } from "@/model/Bookmark";
import axios from "axios";
import Cookies from "js-cookie";

export const bookmark_product = async (formData: CreateBookmarkSchema) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookmark/addBookmark`, null, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      params: formData
    });

    return res;
  } catch (error) {
    console.log('Error in Add product to bookmark (service) =>', error);
  }
}



export const get_all_bookmark_items = async (customerId: number) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookmark/viewBookmarks`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      params: { customerId }
    });

    return res;
  } catch (error) {
    console.log('Error in getting all bookmark Item for specific User (service) =>', error)
  }
}


export const delete_a_bookmark_item = async (customerId: number, productId: number) => {
  try {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookmark/removeBookmark`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      params: { customerId, productId }
    })

    return res;
  } catch (error) {
    console.log('Error in deleting Bookmark Item (service) =>', error)
  }
}
