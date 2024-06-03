import { userSelector } from "@/redux/slices/user.slice.js";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthContainer = () => {
  const { info } = useSelector(userSelector);

  if (!info) return <Navigate to="/" />;

  return <Outlet />;
};

export default AuthContainer;
