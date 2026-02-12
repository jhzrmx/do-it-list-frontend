import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import NotFound from "./pages/404";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

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
