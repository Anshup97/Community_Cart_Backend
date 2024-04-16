'use client'

import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from '@/utils/resolvers';



export const store = configureStore({
    reducer: rootReducer
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;