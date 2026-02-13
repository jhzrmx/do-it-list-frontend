import Home from "@/pages/Home";
import { useAuthStore } from "@/stores/auth.store";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <Home />;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
