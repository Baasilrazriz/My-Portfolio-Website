import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "./Features/navbarSlice";
import homeReducer from "./Features/homeSlice";
import socialAccountReducer from "./Features/socialAccountSlice";
import aboutReducer from "./Features/aboutSlice";
import educationReducer from "./Features/educationSlice";
import skillsReducer from "./Features/skillsSlice";
import projectReducer from "./Features/projectSlice";
import certificateReducer from "./Features/certificateSlice";
export const store = configureStore({
  reducer: {
    navbar:navbarReducer,
    home:homeReducer,
    social:socialAccountReducer,
    about:aboutReducer,
    education:educationReducer,
    skills:skillsReducer,
    projects:projectReducer,
    certificate:certificateReducer,
  },
});
