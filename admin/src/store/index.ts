// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { authApi } from "./features/auth/authApi";
import { matchApi } from "./features/matches";
import { userApi } from "./features/users";
import { locationApi } from "./features/locations";
import { sportModeApi } from "./features/sportModes";
import { sportApi } from "./features/sports";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [matchApi.reducerPath]: matchApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [sportModeApi.reducerPath]: sportModeApi.reducer,
    [sportApi.reducerPath]: sportApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      matchApi.middleware,
      userApi.middleware,
      locationApi.middleware,
      sportModeApi.middleware,
      sportApi.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
