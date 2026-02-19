import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import NotFound from "./pages/404";
import Error from "./pages/Error";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import SignUp from "./pages/SignUp";
import TermsAndCond from "./pages/TermsAndCond";
import Todos from "./pages/Todos";
import { useAuthStore } from "./stores/auth.store";

/**
 * Main App component that sets up the application routing and authentication flow.
 * This component initializes the authentication state and configures all application routes
 * including protected routes for authenticated users and public routes for unauthenticated users.
 */
const App = () => {
  // Access the authentication store to check user authentication status
  const { checkAuth } = useAuthStore();

  // Check authentication status on component mount to restore user session
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Configure the application router with nested routes for different user states
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Outlet,
      errorElement: <Error />,
      children: [
        // Public routes accessible to all users
        { path: "/", Component: Home },
        { path: "/tc", Component: TermsAndCond },
        { path: "/reset-password", Component: ResetPassword },
        // Protected routes that require authentication
        {
          element: <ProtectedRoute />,
          children: [
            { path: "/todo", Component: Todos },
            { path: "/profile", Component: Profile },
          ],
        },

        // Routes accessible only to unauthenticated users
        {
          element: <PublicOnlyRoute />,
          children: [
            { path: "/login", Component: Login },
            { path: "/signup", Component: SignUp },
            { path: "/forgot-password", Component: ForgetPassword },
          ],
        },
        // Catch-all route for 404 errors
        { path: "*", Component: NotFound },
      ],
    },
  ]);

  return (
    <div>
      {/* Toast notifications provider for displaying user feedback */}
      <Toaster position="top-center" reverseOrder={false} />
      {/* Router provider that renders the appropriate component based on the current URL */}
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
