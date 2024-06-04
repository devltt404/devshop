import { authSelector } from "@/redux/slices/auth.slice.js";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const useAuth = () => {
  const { user } = useSelector(authSelector);

  return useMemo(() => {
    return { user };
  }, [user]);
};

export default useAuth;
