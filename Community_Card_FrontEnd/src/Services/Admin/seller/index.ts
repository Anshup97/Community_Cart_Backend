import { UpdateSellerSchema, CreateSellerSchema } from "@/model/Seller";
import axios from "axios";
import Cookies from "js-cookie";


export const get_seller = async (params: { categoryId?: number, sellerId?: number, sourceLatitude?: number, sourceLongitude?: number, elevation?: number }) => {
  try {
    let queryParams: Partial<{
      categoryId: number,
      sellerId: number,
      sourceLat: number,
      sourceLng: number,
      elevation: number
    }> = {};
    let endpoint = '/seller/getSeller';

    if (params.sellerId) {
      queryParams.sellerId = params.sellerId;
    } else {
      endpoint = '/seller/getNearbySellers'
      if (params.sourceLatitude && params.sourceLongitude && params.elevation) {
        queryParams.sourceLat = params.sourceLatitude;
        queryParams.sourceLng = params.sourceLongitude;
        queryParams.elevation = params.elevation;
      }

      if (params.categoryId) queryParams.categoryId = params.categoryId;
    }

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, { params: queryParams });

    return res;
  } catch (error) {
    throw new Error('Error in getting all Categories (service) =>' + error)
  }
}

export const get_nearby_sellers = async (sourceLatitude: number, sourceLongitude: number) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/seller/getNearbySellers`, {
      params: { sourceLatitude, sourceLongitude }
    });
    return res;
  } catch (error) {
    throw new Error('Error in getting all Categories (service) =>' + error)
  }
}

export const get_sellers_by_category_id = async (categoryId: number) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/seller/getNearbySellers`, { params: { categoryId } });
    return res;
  } catch (error) {
    throw new Error('Error in getting all Categories (service) =>' + error)
  }
}

export const add_new_seller = async (formData: CreateSellerSchema) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/seller/addSeller`, JSON.stringify(formData), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      }
    });

    return res;
  } catch (error) {
    throw new Error('Error in Add New Seller (service) =>' + error);
  }
}

export const delete_seller = async (id: string) => {
  try {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/seller/deleteSeller`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      params: {
        sellerId: id
      }
    })

    return res;
  } catch (error) {
    throw new Error('Error in deleting Categories (service) =>' + error);
  }
}


export const update_a_seller = async (formData: UpdateSellerSchema) => {
  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/seller/updateSeller`, JSON.stringify(formData), {
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




