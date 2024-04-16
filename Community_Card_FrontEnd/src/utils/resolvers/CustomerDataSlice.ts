import { BookmarkSchema } from '@/model/Bookmark';
import { CartViewSchema } from '@/model/Cart';
import { CategorySchema } from '@/model/Category';
import { OrderSchema } from '@/model/Order';
import { ProductSchema } from '@/model/Product';
import { SellerSchema } from '@/model/Seller'
import { CustomerSchema } from '@/model/User'
import { createSlice } from '@reduxjs/toolkit'

interface CustomerState {
  CustomerData: CustomerSchema | null,
  categories: CategorySchema[],
  featuredProducts: ProductSchema[],
  nearbySellers: Record<number, SellerSchema>,
  cart: CartViewSchema | null;
  total: number;
  bookmark: BookmarkSchema | null;
  order: OrderSchema[];
  cartUpdate: boolean;
  orderUpdate: boolean;
  bookmarkUpdate: boolean;
}

const initialState: CustomerState = {
  CustomerData: null,
  categories: [],
  featuredProducts: [],
  nearbySellers: [],
  cartUpdate: false,
  bookmarkUpdate: false,
  orderUpdate: false,
  cart: null,
  total: 0,
  bookmark: null,
  order: [],
}

export const CustomerSlice = createSlice({
  name: 'Customer',
  initialState,
  reducers: {
    setCustomerData: (state, action: { payload: CustomerSchema, type: string }) => {
      state.CustomerData = action.payload
    },
    setCategoriesForCustomer: (state, action) => {
      state.categories = action.payload
    },
    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload
    },
    setNearbySellers: (state, action: { payload: SellerSchema[], type: string }) => {
      action.payload.forEach((seller) => {
        state.nearbySellers[seller.sellerId] = seller;
      })
    },
    setCart: (state, action: { payload: CartViewSchema, type: string }) => {
      state.cart = action.payload
      console.log("CART SET-----------")
      console.log(state.cart)
    },
    setTotalPrice: (state, action) => {
      state.total = action.payload
    },
    setBookmark: (state, action) => {
      state.bookmark = action.payload
    },
    setOrder: (state, action: { payload: OrderSchema[], type: string }) => {
      state.order = action.payload
    },
    setCustomerOrderUpdate: (state, action) => {
      state.orderUpdate = action.payload
    },
    setCartUpdate: (state, action) => {
      state.cartUpdate = action.payload
    },
    setBookmarkUpdate: (state, action) => {
      state.bookmarkUpdate = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCustomerData, setCategoriesForCustomer, setNearbySellers, setBookmark, setCart, setTotalPrice, setOrder, setBookmarkUpdate, setCartUpdate, setFeaturedProducts, setCustomerOrderUpdate } = CustomerSlice.actions

export const CustomerReducer = CustomerSlice.reducer