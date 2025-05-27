import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthorRoute = () => {
  const { loading, isAuthenticated, isAuthor, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthor && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};
export default AuthorRoute;
