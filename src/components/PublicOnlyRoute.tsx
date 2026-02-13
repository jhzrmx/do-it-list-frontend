import { useAuthStore } from "@/stores/auth.store";
import { Navigate, Outlet } from "react-router-dom";

const PublicOnlyRoute = () => {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return null;

  return user ? <Navigate to="/todo" replace /> : <Outlet />;
};

export default PublicOnlyRoute;
