// components/ProtectedTarotRoutes.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedTarotRoutes = () => {
  const user = useSelector((state) => state.tarotista);
  const token = useSelector((state) => state.tarotista.token);
  const role = useSelector((state) => state.tarotista.role);
  



  if (!token || !user) {
    return <Navigate to="/loginTarot" />;
  }

  if (role !== "tarotista") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedTarotRoutes;
