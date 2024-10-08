import useAuth from "@/hooks/useAuth.jsx";
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Card } from "../ui/card.jsx";

const AuthFormWrapper = () => {
  const { user } = useAuth();

  return user ? (
    <Navigate to="/" />
  ) : (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="mx-2 max-w-lg shadow-lg">
        <Suspense>
          <Outlet />
        </Suspense>
      </Card>
    </div>
  );
};

export default AuthFormWrapper;
