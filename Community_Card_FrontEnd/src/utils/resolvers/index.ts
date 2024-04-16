import { UserReducer } from './UserDataSlice'
import { CustomerReducer } from './CustomerDataSlice'
import { SellerReducer } from './SellerSlice'
import { combineReducers } from '@reduxjs/toolkit'

export const RESET_ACTION = {
  type:"RESET_STORE"
}

const appReducer = combineReducers({
  User: UserReducer,
  Customer: CustomerReducer,
  Seller: SellerReducer,
})

export const rootReducer = (state: any, action: any) => {
  if (action === RESET_ACTION) {
    return appReducer(undefined, action)
  }
  return appReducer(state, action)
}