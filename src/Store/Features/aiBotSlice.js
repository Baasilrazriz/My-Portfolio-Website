import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  isMinimized: false,
};

const aiBotSlice = createSlice({
  name: 'aiBot',
  initialState,
  reducers: {
    toggleAIBot: (state) => {
      state.isOpen = !state.isOpen;
      if (!state.isOpen) {
        state.isMinimized = false;
      }
    },
    openAIBot: (state) => {
      state.isOpen = true;
      state.isMinimized = false;
    },
    closeAIBot: (state) => {
      state.isOpen = false;
      state.isMinimized = false;
    },
    toggleMinimize: (state) => {
      state.isMinimized = !state.isMinimized;
    },
    setMinimized: (state, action) => {
      state.isMinimized = action.payload;
    }
  },
});

export const { 
  toggleAIBot, 
  openAIBot, 
  closeAIBot, 
  toggleMinimize, 
  setMinimized 
} = aiBotSlice.actions;

export default aiBotSlice.reducer;
