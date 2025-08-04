import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import tarotistasReducer from "./tarotistasSlice";
import tarotistaReducer from "./tarotistaSlice";
import postReducer from "./postSlice"; 
import onlineTarotistasReducer from "./onlineTarotistasSlice";
import favoritosReducer from "./favoritosSlice";

// Función para guardar en localStorage
const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("tarotista", JSON.stringify(state.tarotista));
    localStorage.setItem("posts", JSON.stringify(state.posts));
    localStorage.setItem("favoritos", JSON.stringify(state.favoritos));
  } catch (error) {
    console.error("Error guardando en localStorage", error);
  }
};

const loadFromLocalStorage = () => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedTarotista = localStorage.getItem("tarotista");
    const storedPosts = localStorage.getItem("posts");
    const storedFavoritos = localStorage.getItem("favoritos");

    console.log('Cargando desde localStorage:', { storedUser, storedTarotista, storedPosts, storedFavoritos });

    return {
      user: storedUser ? JSON.parse(storedUser) : {},
      tarotista: storedTarotista ? JSON.parse(storedTarotista) : {},
      posts: storedPosts ? JSON.parse(storedPosts) : [],
      favoritos: storedFavoritos ? JSON.parse(storedFavoritos) : [],
    };
  } catch (error) {
    console.error("Error cargando desde localStorage", error);
    return { user: {}, tarotista: {}, posts: [], favoritos: [] };
  }
};

const store = configureStore({
  reducer: {
    user: userReducer,
    tarotistas: tarotistasReducer,
    tarotista: tarotistaReducer,
    posts: postReducer, 
    onlineTarotistas: onlineTarotistasReducer,
    favoritos: favoritosReducer,
  },
  preloadedState: loadFromLocalStorage(),
});

// Suscribirse a los cambios en el store para guardar en localStorage
store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
