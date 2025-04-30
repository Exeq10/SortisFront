import { Navigate, Outlet } from "react-router-dom";
import {useSelector} from 'react-redux'

const ProtectedRoutes = () => {

  const user = useSelector((state) => state.user);
  const role = useSelector((state) => state.user.role);



  const auth = user.token ||  JSON.parse(localStorage.getItem("user"))?.token;


  if (!auth) {
    return <Navigate to="/login" />;
  }
  if (role == "tarotista") {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
