import { Navigate, Outlet } from "react-router-dom";
import {useSelector} from 'react-redux'

const ProtectedRoutes = () => {

  const user = useSelector((state) => state.user);



  const auth = user.token || false

  if (!auth) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
