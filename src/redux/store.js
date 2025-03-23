import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

// Función para guardar en localStorage
const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem("user", JSON.stringify(state.user));
  } catch (error) {
    console.error("Error guardando en localStorage", error);
  }
};

// Función para cargar desde localStorage
const loadFromLocalStorage = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : undefined;
  } catch (error) {
    console.error("Error cargando desde localStorage", error);
    return undefined;
  }
};

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: { user: loadFromLocalStorage() || {} },
});

// Suscribirse a los cambios en el store para guardar en localStorage
store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
