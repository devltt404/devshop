import { userSelector } from "@/redux/slices/user.slice.js";
import { useSelector } from "react-redux";

const useAuth = () => {
  const { info } = useSelector(userSelector);
  return { isAuthenticated: !!info };
};

export default useAuth;
