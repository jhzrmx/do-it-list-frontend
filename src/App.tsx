import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import NotFound from "./pages/404";
import Error from "./pages/Error";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import SignUp from "./pages/SignUp";
import TermsAndCond from "./pages/TermsAndCond";
import Todos from "./pages/Todos";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Outlet,
      errorElement: <Error />,
      children: [
        { path: "/", Component: Home },
        { path: "/login", Component: Login },
        { path: "/signup", Component: SignUp },
        { path: "/tc", Component: TermsAndCond },
        { path: "/forgot-password", Component: ForgetPassword },
        { path: "/password-reset", Component: PasswordReset },
        { path: "/todo", Component: Todos },
        { path: "*", Component: NotFound },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
