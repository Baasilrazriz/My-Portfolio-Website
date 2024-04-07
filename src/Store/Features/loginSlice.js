import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  admin: false,
  
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
  }
});

export const {} = loginSlice.actions;
export default loginSlice.reducer;
