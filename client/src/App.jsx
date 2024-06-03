import Cookies from "js-cookie";
import AppRoutes from "./components/AppRoutes.jsx";
import LoadingScreen from "./components/loading/LoadingScreen.jsx";
import { useAuthUserQuery } from "./services/auth.service.js";

export default function App() {
  // Check auth if session exists
  const { isLoading } = useAuthUserQuery(null, {
    skip: !Cookies.get("session"),
  });

  return !isLoading ? <AppRoutes /> : <LoadingScreen />;
}
