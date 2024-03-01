import { createSlice } from '@reduxjs/toolkit';
    const initialState = {
     toggleNavbarDropdown: false,
    };
    
    const navbarSlice = createSlice({
      name: 'navbar',
      initialState,
      reducers: {
        toggleNavbarDropdown:(state)=>{
            state.toggleNavbarDropdown = !state.toggleNavbarDropdown;
            
        },
      },
    });
    
    export const {toggleNavbarDropdown} = navbarSlice.actions;
    export default navbarSlice.reducer;
    