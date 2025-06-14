import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id:"",
  name: "",
  email: "",
  password: "",
  image: "",
  role: "",
  bio: "",
  experience: "",
  rates: 0,
  sign: "",
  availability: [],
  ratings: [],
  isFirstLogin: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetUser: () => {
      localStorage.removeItem("user"); 
      return initialState;
    },
  },
});

export const { setUser, updateUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
