import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { auth } = useAuth();
  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !!allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
