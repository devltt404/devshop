import useAuth from "@/hooks/useAuth.jsx";
import { Navigate, Outlet } from "react-router-dom";

const GuestWrapper = () => {
  const { user } = useAuth();

  return user ? <Navigate to="/" /> : <Outlet />;
};

export default GuestWrapper;
