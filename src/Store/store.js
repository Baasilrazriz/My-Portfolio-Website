import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "./Features/navbarSlice";
export const store = configureStore({
  reducer: {
    navbar:navbarReducer
  },
});
