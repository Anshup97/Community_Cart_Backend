

import { CategorySchema, CreateCategorySchema } from "@/model/Category";
import axios from "axios";
import Cookies from "js-cookie";


export const get_all_categories = async (sellerId?: number) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/seller/getSellerCategories`, {
      params: sellerId ? { sellerId } : {}
    });

    return res;
  } catch (error) {
    throw new Error('Error in getting all Categories (service) =>' + error)
  }
}

export const add_new_category = async (formData: CreateCategorySchema, email: string) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/addCategory`, JSON.stringify(formData), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      }
    });

    return res;
  } catch (error) {
    throw new Error('Error in Add New Category (service) =>' + error);
  }
}


export const get_category_by_id = async (id: string) => {
  try {
    const res = await axios.get<CategorySchema>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/getCategoryById`,
      {
        params: {
          categoryId: id
        }
      });

    return res;
  } catch (error) {
    throw new Error('Error in getting Categories by Id (service) =>' + error);
  }
}

export const delete_a_category = async (id: number) => {
  try {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/deleteCategory`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      params: {
        categoryId: id
      }
    })

    return res;
  } catch (error) {
    throw new Error('Error in deleting Categories (service) =>' + error);
  }
}


export const update_a_category = async (formData: CategorySchema) => {
  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/updateCategory`, JSON.stringify(formData), {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'application/json'
      }
    })

    return res;
  } catch (error) {
    throw new Error('Error in updating Categories (service) =>' + error);
  }
}




