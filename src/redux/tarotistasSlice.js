import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const tarotistasSlice = createSlice({
  name: "Tarotistas",
  initialState,
  reducers: {
    setTarotistas: (state, action) => {
      return action.payload; 
    },
  },
});

export const { setTarotistas } = tarotistasSlice.actions;
export default tarotistasSlice.reducer;
