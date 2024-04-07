import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  editProject: false,
  projects: [
    {
      title: "Ecommerce Web App",
      image: "",
      description:
        "Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.",
      skills: ["React JS", "Asp.net", "Tailwind css", "SQL", "RTK"],
      link: "",
      type: "Web",
    },
  ],
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    OpenProjectModal: (state) => {
      state.editProject = true;
    },
    closeProjectModal: (state) => {
      state.editProject = false;
    },
  },
});

export const {OpenProjectModal,closeProjectModal} = projectSlice.actions;
export default projectSlice.reducer;
