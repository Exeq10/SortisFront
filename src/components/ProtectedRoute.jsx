import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const auth = true // Reemplaza con tu lógica de autenticación

  if (!auth) {
    return <Navigate to="/login" />;
  }

  return <Outlet />; // Renderiza las rutas protegidas definidas en `children`
};

export default ProtectedRoutes;
