import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { aboutApi } from "api/aboutSlice";
import { CategoryApi } from "api/categorySlice";
import { filesApi } from "api/filesSlice";
import { privacyApi } from "api/privacySlice";
import { roleApi } from "api/roleSlice";
import { apiService } from "api/userSlice";

// import { userApi, authReducer } from './userSlice';

export const store = configureStore({
  reducer: {
    [apiService.reducerPath]: apiService.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [CategoryApi.reducerPath]:CategoryApi.reducer,
    [privacyApi.reducerPath]:privacyApi.reducer,
    [aboutApi.reducerPath]:aboutApi.reducer,
    [filesApi.reducerPath]:filesApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiService.middleware,
      roleApi.middleware,
      CategoryApi.middleware,
      privacyApi.middleware,
      aboutApi.middleware,
      filesApi.middleware,
    ),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// See `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
