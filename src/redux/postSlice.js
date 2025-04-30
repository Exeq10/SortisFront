import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      return action.payload; 
    },
  },
});

export const { setPosts } = postSlice.actions;
export default postSlice.reducer;
