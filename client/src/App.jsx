import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./components/AppRoutes.jsx";
import LoadingScreen from "./components/loading/LoadingScreen.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import ScrollToTopWrapper from "./components/wrappers/ScrollToTopWrapper.jsx";
import { useAuthUserQuery } from "./redux/api/auth.api.js";
import { setUser } from "./redux/slices/auth.slice.js";

export default function App() {
  const dispatch = useDispatch();

  // Check auth if session exists
  const { isLoading, data } = useAuthUserQuery(null, {
    skip: !Cookies.get("session"),
  });

  useEffect(() => {
    if (data) {
      dispatch(setUser(data.metadata?.user));
    }
  }, [data]);

  return (
    <ScrollToTopWrapper>
      {isLoading ? <LoadingScreen /> : <AppRoutes />}
      <Toaster />
    </ScrollToTopWrapper>
  );
}
