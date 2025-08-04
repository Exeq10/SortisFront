import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const favoritosSlice = createSlice({
  name: "favoritos",
  initialState,
  reducers: {
    addFavorito: (state, action) => {
      if (!state.includes(action.payload)) {
        state.push(action.payload);
        localStorage.setItem("favoritos", JSON.stringify(state));
      }
    },
    removeFavorito: (state, action) => {
      const newState = state.filter(id => id !== action.payload);
      localStorage.setItem("favoritos", JSON.stringify(newState));
      return newState;
    },
    setFavoritos: (state, action) => {
      return action.payload;
    }
  }
});

export const { addFavorito, removeFavorito, setFavoritos } = favoritosSlice.actions;
export default favoritosSlice.reducer;
