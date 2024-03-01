import { createSlice } from '@reduxjs/toolkit';
    const initialState = {
     image:"https://c0.wallpaperflare.com/preview/524/860/912/screen-code-coding-programming.jpg",
     description:"Passionate software engineering student at Bahria University, proficient in HTML, CSS, Bootstrap, Tailwind CSS, JavaScript, ReactJS, NodeJS, Asp.net, C#, Java, MongoDB, and SQL. I aim to use my expertise to contribute effectively in a professional setting.",
    };
    
    const homeSlice = createSlice({
      name: 'home',
      initialState,
      reducers: {
           setImage:(state,action)=>{
            state.image= action.payload;
        },
           setDescription:(state,action)=>{
            state.description= action.payload;
        },
      },
    });
    
    export const {setImage,setDescription} = homeSlice.actions;
    export default homeSlice.reducer;
    