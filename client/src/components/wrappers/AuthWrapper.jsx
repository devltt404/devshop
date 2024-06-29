import useAuth from "@/hooks/useAuth.jsx";
import { Navigate, Outlet } from "react-router-dom";

const AuthWrapper = () => {
  const { user } = useAuth();

  return !user ? <Navigate to="/login" /> : <Outlet />;
};

export default AuthWrapper;
