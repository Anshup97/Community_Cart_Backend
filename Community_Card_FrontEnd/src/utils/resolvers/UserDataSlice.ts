import { LocationSchema, UserSessionSchema } from '@/model/User'
import { createSlice } from '@reduxjs/toolkit'

interface UserState {
  userData: UserSessionSchema | null,
  userToken: string | null,
  location: LocationSchema | null,
}

const initialState: UserState = {
  userData: null,
  userToken: null,
  location: null
}

export const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setUserData: (state, action: { payload: UserSessionSchema, type: string }) => {
      state.userData = action.payload
    },
    setUserLocation: (state, action: { payload: LocationSchema, type: string }) => {
      state.location = action.payload
    },
    setUserToken: (state, action) => {
      state.userToken = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUserData, setUserToken, setUserLocation } = userSlice.actions

export const UserReducer = userSlice.reducer