import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import NotFound from "./pages/404";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import TermsAndCond from "./pages/TermsAndCond";
import Todos from "./pages/Todos";
import { useAuthStore } from "./stores/auth.store";

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const router = createBrowserRouter([
    {
      path: "/",
      Component: Outlet,
      errorElement: <Error />,
      children: [
        { path: "/", Component: Home },
        { path: "/tc", Component: TermsAndCond },
        /* Unimplemented Routes (No Backend)
        { path: "/forgot-password", Component: ForgetPassword },
        { path: "/password-reset", Component: PasswordReset },
        */
        {
          element: <ProtectedRoute />,
          children: [
            { path: "/todo", Component: Todos },
            { path: "/profile", Component: Profile },
          ],
        },

        {
          element: <PublicOnlyRoute />,
          children: [
            { path: "/login", Component: Login },
            { path: "/signup", Component: SignUp },
          ],
        },

        { path: "*", Component: NotFound },
      ],
    },
  ]);

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
