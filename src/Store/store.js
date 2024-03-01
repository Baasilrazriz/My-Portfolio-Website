import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "./Features/navbarSlice";
import homeReducer from "./Features/homeSlice";
import socialAccountReducer from "./Features/socialAccountSlice";
export const store = configureStore({
  reducer: {
    navbar:navbarReducer,
    home:homeReducer,
    social:socialAccountReducer,
  },
});
