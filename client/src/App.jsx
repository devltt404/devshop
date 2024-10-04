import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./components/AppRoutes.jsx";
import LoadingScreen from "./components/loading/LoadingScreen.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import ScrollToTopWrapper from "./components/wrappers/ScrollToTopWrapper.jsx";
import { useAuthUserQuery } from "./redux/api/auth.api.js";
import {
  authSelector,
  setAuthLoading,
  setUser,
} from "./redux/slices/auth.slice.js";

export default function App() {
  const dispatch = useDispatch();
  const { isAuthLoading } = useSelector(authSelector);

  const { data, error, isLoading } = useAuthUserQuery();

  useEffect(() => {
    dispatch(setAuthLoading(isLoading));
    if (data) {
      dispatch(setUser(data.metadata?.user));
    }
  }, [data, error, isLoading]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ScrollToTopWrapper>
        {isAuthLoading ? <LoadingScreen /> : <AppRoutes />}
        <Toaster />
      </ScrollToTopWrapper>
    </GoogleOAuthProvider>
  );
}
