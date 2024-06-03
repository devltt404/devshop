import Cookies from "js-cookie";
import { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./components/AppRoutes.jsx";
import LoadingScreen from "./components/loading/LoadingScreen.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import { setUserInfo } from "./redux/slices/user.slice.js";
import { useAuthUserQuery } from "./services/auth.service.js";

export default function App() {
  const dispatch = useDispatch();

  // Check auth if session exists
  const { isLoading, data } = useAuthUserQuery(null, {
    skip: !Cookies.get("session"),
  });

  useEffect(() => {
    if (data) {
      dispatch(setUserInfo(data.metadata.user));
    }
  }, [data]);

  return (
    <Fragment>
      {isLoading ? <LoadingScreen /> : <AppRoutes />}
      <Toaster />
    </Fragment>
  );
}
