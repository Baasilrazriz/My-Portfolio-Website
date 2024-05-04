import { createSlice } from '@reduxjs/toolkit';
    const initialState = {
     socialAccounts:[
        {
            name: 'facebook',
            url : 'https://www.facebook.com/muhammadbaasil.irfan',
            image:''
        },
        {
        name:'instagram',
        url:'https://www.instagram.com/basilrazriz/',
        image:'',
        },
        {
        name:'linkedIn',
        url:'https://www.linkedin.com/in/muhammad-basil-irfan-rizvi-886157215/',
        image:'',
        },
        {
        name:'github',
        url:'https://github.com/Baasilrazriz',
        image:'',
        },
     ]
    };
    
    const socialAccountSlice = createSlice({
      name: 'social',
      initialState,
      reducers: {

      },
    });
    
    export const {} = socialAccountSlice.actions;
    export default socialAccountSlice.reducer;
    