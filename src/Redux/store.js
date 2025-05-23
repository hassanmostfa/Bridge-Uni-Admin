import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { aboutApi } from "api/aboutSlice";
import { CategoryApi } from "api/categorySlice";
import { filesApi } from "api/filesSlice";
import { privacyApi } from "api/privacySlice";
import { roleApi } from "api/roleSlice";
import { apiService } from "api/userSlice";
import { partnersApi } from "api/partners";
import { joinUsApi } from "api/joinUs";
import { inquiresApi } from "api/Inquiries";
import { bannersApi } from "api/banners";
import { providerApi } from "api/providerSlice";
import { positionsApi } from "api/positionSlice";
import { contactApi } from "api/contactSlice";
import { popularMajors } from "api/popularMajors";
import { studentTestimonialApi } from "api/studentTestimonials";
import { onlineCourseApi } from "api/onlineCourseSlice";
import { blogApi } from "api/blogs";
import { shortCourseApi } from "api/shortCourcesSlice";
import { studyAbroadApi } from "api/studyAbroadSlice";
import { socialApi } from "api/socials";
import { whyUniBridgeApi } from "api/why";
import { requestApi } from "api/requestSlice";
import { CoursesInquiresApi } from "api/coursesInquires";
// import { userApi, authReducer } from './userSlice';

export const store = configureStore({
  reducer: {
    [apiService.reducerPath]: apiService.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [CategoryApi.reducerPath]:CategoryApi.reducer,
    [privacyApi.reducerPath]:privacyApi.reducer,
    [aboutApi.reducerPath]:aboutApi.reducer,
    [filesApi.reducerPath]:filesApi.reducer,
    [partnersApi.reducerPath]:partnersApi.reducer,
    [joinUsApi.reducerPath]:joinUsApi.reducer,
    [inquiresApi.reducerPath]:inquiresApi.reducer,
    [bannersApi.reducerPath]:bannersApi.reducer,
    [providerApi.reducerPath]:providerApi.reducer,
    [positionsApi.reducerPath]:positionsApi.reducer,
    [contactApi.reducerPath]:contactApi.reducer,
    [popularMajors.reducerPath]:popularMajors.reducer,
    [onlineCourseApi.reducerPath]:onlineCourseApi.reducer,
    [blogApi.reducerPath]:blogApi.reducer,
    [shortCourseApi.reducerPath]:shortCourseApi.reducer,
    [studentTestimonialApi.reducerPath]:studentTestimonialApi.reducer,
    [studyAbroadApi.reducerPath]:studyAbroadApi.reducer,
    [socialApi.reducerPath]:socialApi.reducer,
    [whyUniBridgeApi.reducerPath]:whyUniBridgeApi.reducer,
    [requestApi.reducerPath]:requestApi.reducer,
    [CoursesInquiresApi.reducerPath]:CoursesInquiresApi.reducer
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiService.middleware,
      roleApi.middleware,
      CategoryApi.middleware,
      privacyApi.middleware,
      aboutApi.middleware,
      filesApi.middleware,
      partnersApi.middleware,
      joinUsApi.middleware,
      inquiresApi.middleware,
      bannersApi.middleware,
      providerApi.middleware,
      positionsApi.middleware,
      contactApi.middleware,
      popularMajors.middleware,
      onlineCourseApi.middleware,
      blogApi.middleware,
      shortCourseApi.middleware,
      studentTestimonialApi.middleware,
      studyAbroadApi.middleware,
      socialApi.middleware,
      whyUniBridgeApi.middleware,
      requestApi.middleware,
      CoursesInquiresApi.middleware
    ),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// See `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
