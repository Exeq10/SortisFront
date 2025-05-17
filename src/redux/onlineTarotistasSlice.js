// redux/onlineTarotistasSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const onlineTarotistasSlice = createSlice({
  name: "onlineTarotistas",
  initialState: [],
  reducers: {
    setOnlineTarotistas: (state, action) => {
      return action.payload;
    },
  },
});

export const { setOnlineTarotistas } = onlineTarotistasSlice.actions;
export default onlineTarotistasSlice.reducer;
