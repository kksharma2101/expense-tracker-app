import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const [{ user, authLoading }] = useAuth();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center my-auto h-screen">
        Loading authentication...
      </div>
    );
  }

  if (user) {
    return children ? children : <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
};
