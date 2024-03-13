import { createSlice } from '@reduxjs/toolkit';
    const initialState = {
        projects:[
            {
              title:"Ecommerce Web App",
              image:"",
              description:"Fingerstache flexitarian street art 8-bit waistcoat. Distillery hexagon disrupt edison bulbche.",
              skills:["React JS","Asp.net","Tailwind css","SQL","RTK"],
              link:'',
              type:"Web",
            },
          
          ]
    };
    
    const projectSlice = createSlice({
      name: 'projects',
      initialState,
      reducers: {

      },
    });
    
    export const {} = projectSlice.actions;
    export default projectSlice.reducer;
    