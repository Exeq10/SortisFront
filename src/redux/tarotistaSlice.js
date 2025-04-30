import { createSlice } from "@reduxjs/toolkit";

const persistedTarotista = JSON.parse(localStorage.getItem("tarotista"));

const initialState = persistedTarotista || {
  _id: "",
  name: "",
  email: "",
  password: "",
  role: "tarotista",
  bio: "",
  experience: "",
  rates: 0,
  sign: "",
  birthdate: null,
  availability: [],
  ratings: [],
  services: [],
  image: "",
};


const tarotistaSlice = createSlice({
  name: "tarotista",
  initialState,
  reducers: {
    setTarotista: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateTarotista: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetTarotista: () => {
      localStorage.removeItem("tarotista"); 
      return initialState;
    },
  },
});

export const { setTarotista, updateTarotista, resetTarotista } = tarotistaSlice.actions;
export default tarotistaSlice.reducer;
