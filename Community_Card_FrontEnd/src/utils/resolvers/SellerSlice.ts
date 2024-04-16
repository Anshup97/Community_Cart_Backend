import { CategorySchema } from '@/model/Category'
import { OrderSchema } from '@/model/Order'
import { ProductSchema } from '@/model/Product'
import { SellerSchema } from '@/model/Seller'
import { createSlice } from '@reduxjs/toolkit'

interface SellerState {
  seller: SellerSchema | null,
  product: { [id: string]: ProductSchema },
  categories: any[],
  allCategories: { [id: string]: CategorySchema },
  Order: OrderSchema[],
  catUpdate: boolean,
  prodUpdate: boolean,
  orderUpdate: boolean,
  ActiveNav: string,
}

const initialState: SellerState = {
  seller: null,
  product: {},
  categories: [],
  allCategories: {},
  Order: [],
  catUpdate: false,
  prodUpdate: false,
  orderUpdate: false,
  ActiveNav: 'Base'
}

export const Seller = createSlice({
  name: 'SellerData',
  initialState,
  reducers: {
    setSellerData: (state, action) => {
      state.seller = action.payload
    },
    setProductData: (state, action: { type: string, payload: ProductSchema[] }) => {
      state.product = {};
      action.payload.forEach(prod => {
        state.product[prod.productId] = prod
      })
    },
    setOrderData: (state, action) => {
      state.Order = action.payload
    },
    setCategoriesForSeller: (state, action) => {
      state.categories = action.payload
    },
    setAllCategories: (state, action: { type: string, payload: CategorySchema[] }) => {
      state.allCategories = {};
      action.payload.forEach((category) => {
        state.allCategories[category.categoryId] = category;
      })
    },
    setCatUpdate: (state, action) => {
      state.catUpdate = action.payload
    },
    setProdUpdate: (state, action) => {
      state.prodUpdate = action.payload
    },
    setOrderUpdate: (state, action) => {
      state.orderUpdate = action.payload
    },
    setNavActive: (state, action) => {
      state.ActiveNav = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setSellerData, setProductData, setOrderData, setCategoriesForSeller, setAllCategories, setCatUpdate, setOrderUpdate, setProdUpdate, setNavActive } = Seller.actions

export const SellerReducer = Seller.reducer