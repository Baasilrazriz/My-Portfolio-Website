import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  socialAccounts: [
    {
      name: 'facebook',
      url: 'https://www.facebook.com/muhammadbaasil.irfan',

    },
    {
      name: 'instagram',
      url: 'https://www.instagram.com/basilrazriz/',

    },
    {
      name: 'linkedIn',
      url: 'https://www.linkedin.com/in/muhammad-basil-irfan-rizvi-886157215/',

    },
    {
      name: 'github',
      url: 'https://github.com/Baasilrazriz',
    },
  ]
};

const socialAccountSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {

  },
});

export const { } = socialAccountSlice.actions;
export default socialAccountSlice.reducer;
