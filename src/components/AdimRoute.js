import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { ROLES } from "../constants/roles";

const AdminRoute = () => {
  const { user } = useAuth();

  if (!user || user.role !== ROLES.ADMIN) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
