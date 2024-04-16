import { CreateProductSchema, ProductSchema, UpdateProductSchema } from "@/model/Product";
import axios from "axios";
import Cookies from "js-cookie";



export const add_new_product = async (formData: CreateProductSchema) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/addProduct`, JSON.stringify(formData), {
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

export const upload_product_photo = async (photo: File, productId: number) => {

  try {
    console.log("Uploading photo")
    var photoFormData = new FormData();
    photoFormData.append('productImage', photo);

    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/uploadImage/product`,
      photoFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        params: { productId }
      })

    return res;
  } catch (error) {
    throw new Error('error in register (service) => ' + error);
  }
}


export const get_all_products = async (params?: { sellerId?: number, categoryId?: number }) => {
  try {
    let queryParams: Partial<{
      categoryId: number,
      sellerId: number
    }> = {};
    if (params) {
      if (params.categoryId) queryParams.categoryId = params.categoryId;
      if (params.sellerId) queryParams.sellerId = params.sellerId;
    }

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/getProducts`, {
      params: queryParams
    });
    return res;
  } catch (error) {
    throw new Error('Error in getting all products (service) =>' + error)
  }
}


export const delete_a_product = async (id: number) => {
  try {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/deleteProduct`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      params: {
        productId: id
      }
    })
    return res;
  } catch (error) {
    throw new Error('Error in deleting Product (service) =>' + error)
  }
}


export const update_a_product = async (formData: UpdateProductSchema) => {
  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/updateProduct`, JSON.stringify(formData), {
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'application/json'
      }
    })

    return res;
  } catch (error) {
    throw new Error('Error in updating Product (service) =>' + error)
  }
}

export const get_product_by_id = async (id: number) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/getProduct`,
      {
        params: {
          productId: id
        }
      })
    return res;
  } catch (error) {
    throw new Error('Error in getting product by Id (service) =>' + error);
  }
}