import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  editProject: false,

  projects: [
    {
      id: 1,
      title: "Ecommerce Web App",
      lang:"React + ASP.net + SQL",
      description:"",
      overview: "Built scalable e-commerce platform with React, ASP.NET, MSSQL and Redux Toolkit.",
      imgUrl:"",
        tech: ["ReactJS", "TailwindCSS","git","Redux Toolkit","Asp.net","MSSQL Server"],
        category: "Web Development",
        live_link: "https://www.google.com",
        git_link: "https://www.google.com",
    },
    {
      id: 2,
      title: "Banking System",
      lang:"C#",
      description:"",
      overview: "Built scalable e-commerce platform with React, ASP.NET, MSSQL and Redux Toolkit.",
      imgUrl:"",
        tech: ["Java", "Twillio Api","Swing","git","MySQL"],
        category: "Desktop App",
        live_link: "https://www.google.com",
        git_link: "https://www.google.com",
    },
    
    {
      id: 3,
      title: "Password & File Management System",
      description:"",
      lang:"C#",
      overview: "Built scalable e-commerce platform with React, ASP.NET, MSSQL and Redux Toolkit.",
      imgUrl:"",
        tech: ["C#", "Windows Form","git","MySql","Twillio Api"],
        category: "Desktop App",
        live_link: "https://www.google.com",
        git_link: "https://www.google.com",
    },
    
    {
      id: 4,
      title: "Airline Management System",
      lang:"C#",
      description:"",
      overview: "Built scalable e-commerce platform with React, ASP.NET, MSSQL and Redux Toolkit.",
      imgUrl:"",
        tech:["C#", "Windows Form","git","MSSQL Server","Twillio Api"],
        category: "Web Development",
        live_link: "https://www.google.com",
        git_link: "https://www.google.com",
    },
    
    {
      id: 5,
      title: "Weather App",
      lang:"Js",
      description:"",
      overview: "Built scalable e-commerce platform with React, ASP.NET, MSSQL and Redux Toolkit.",
      imgUrl:"",
        tech: ["NextJS", "TailwindCSS","git","Redux Toolkit","Weather Api"],
        category: "Web Development",
        live_link: "https://www.google.com",
        git_link: "https://www.google.com",
    },
    
    {
      id: 6,
      title: "Todo List",
      lang:"Js",
      description:"",
      overview: "Built scalable e-commerce platform with React, ASP.NET, MSSQL and Redux Toolkit.",
      imgUrl:"",
        tech: ["ReactJS", "TailwindCSS"],
        category: "Web Development",
        live_link: "https://www.google.com",
        git_link: "https://www.google.com",
    },
    
    {
      id: 7,
      title: "Background Remover Web App",
      lang:"Js",
      description:"",
      overview: "Built scalable e-commerce platform with React, ASP.NET, MSSQL and Redux Toolkit.",
      imgUrl:"",
        tech: ["ReactJS", "TailwindCSS","bg-remove Api"],
        category: "Web Development",
        live_link: "https://www.google.com",
        git_link: "https://www.google.com",
    },
    
    {
      id: 8,
      title: "Piano Kit",
      lang:"Html/CSS",
      description:"",
      overview: "Built scalable e-commerce platform with React, ASP.NET, MSSQL and Redux Toolkit.",
      imgUrl:"",
        tech: ["ReactJS", "TailwindCSS"],
        category: "Web Development",
        live_link: "https://www.google.com",
        git_link: "https://www.google.com",
    },
    
    {
      id: 9,
      title: "Drum Kit game",
      lang:"HTML/CSS + Js",
      description:"",
      overview: "Built scalable e-commerce platform with React, ASP.NET, MSSQL and Redux Toolkit.",
      imgUrl:"",
        tech: ["ReactJS", "TailwindCSS"],
        category: "Web Development",
        live_link: "https://www.google.com",
        git_link: "https://www.google.com",
    },
    
    {
      id: 10,
      title: "Ecommerce Landing Page",
      lang:"Html/CSS",
      description:"",
      overview: "Built scalable e-commerce platform with React, ASP.NET, MSSQL and Redux Toolkit.",
      imgUrl:"",
        tech: ["ReactJS", "TailwindCSS"],
        category: "Web Development",
        live_link: "https://www.google.com",
        git_link: "https://www.google.com",
    },
    
    {
      id: 11,
      title: "Dog Website Landing Page",
      lang:"Html/CSS",
      description:"",
      overview: "Built scalable e-commerce platform with React, ASP.NET, MSSQL and Redux Toolkit.",
      imgUrl:"",
        tech: ["ReactJS", "TailwindCSS"],
        category: "Web Development",
        live_link: "https://www.google.com",
        git_link: "https://www.google.com",
    },
    
    {
      id: 12,
      title: "Roll Dice Game",
      lang:"HTML/CSS + Js",
      description:"",
      overview: "Built scalable e-commerce platform with React, ASP.NET, MSSQL and Redux Toolkit.",
      imgUrl:"",
        tech: ["ReactJS", "TailwindCSS"],
        category: "Web Development",
        live_link: "https://www.google.com",
        git_link: "https://www.google.com",
    },
    
    
    {
      id: 13,
      title: "Band Name Generator",
      lang:"HTML/CSS + Js",
      description:"",
      overview: "Built scalable e-commerce platform with React, ASP.NET, MSSQL and Redux Toolkit.",
      imgUrl:"",
        tech: ["ReactJS", "TailwindCSS"],
        category: "Web Development",
        live_link: "https://www.google.com",
        git_link: "https://www.google.com",
    },
    
    
    {
      id: 14,
      title: "QR Code Generator",
      lang:"Js",
      description:"",
      overview: "Built scalable e-commerce platform with React, ASP.NET, MSSQL and Redux Toolkit.",
      imgUrl:"",
        tech: ["ReactJS", "TailwindCSS"],
        category: "Web Development",
        live_link: "https://www.google.com",
        git_link: "https://www.google.com",
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
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(addProject.pending, (state) => {
  //       state.addProjectStatus = "pending";
  //     })
  //     .addCase(addProject.fulfilled, (state, action) => {
  //       state.addProjectStatus = "success";
  //     })
  //     .addCase(addProject.rejected, (state, action) => {
  //       state.addProjectStatus = "failed";
  //     })
  //     .addCase(fetchProjects.pending, (state) => {
  //       state.addProjectStatus = "pending";
  //     })
  //     .addCase(fetchProjects.fulfilled, (state, action) => {
  //       state.addProjectStatus = "success";
  //       state.projects = action.payload;
  //     })
  //     .addCase(fetchProjects.rejected, (state, action) => {
  //       state.addProjectStatus = "failed";
  //     });
  //   },
});

export const {OpenProjectModal,closeProjectModal} = projectSlice.actions;
export default projectSlice.reducer;
