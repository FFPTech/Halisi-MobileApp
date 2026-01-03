import { configureStore } from '@reduxjs/toolkit'
import farmerReducer from '../features/farmerSlice'
import userReducer from '../features/userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    farmer: farmerReducer,
  },
})

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
