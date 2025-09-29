import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import paymentReducer from './slices/paymentSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    payments: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in AsyncStorage or other React Native specifics
        ignoredActions: ['your/action/type'], 
        ignoredPaths: ['users.someNonSerializableField'], 
      },
    }),
});

// TypeScript types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// export default store;