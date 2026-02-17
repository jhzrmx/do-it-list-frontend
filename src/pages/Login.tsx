import axiosInstance from "@/axios/axios-instance";
import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdKey } from "react-icons/md";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleSignIn = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      window.location.href = "/";
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Login failed! Please try again.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full h-dvh bg-primary flex items-center justify-center">
        <div className="w-full h-[85dvh] bg-secondary rounded-tl-4xl rounded-br-4xl flex items-center justify-center">
          <div className="flex flex-col">
            <div className="w-full flex justify-center items-center">
              <img src={Logo} className="w-28" />
              <h1 className="font-bold text-4xl text-primary text-center m-4">
                Do it list!
              </h1>
            </div>
            <div className="w-full bg-semi-primary rounded-4xl p-6 mt-8">
              <h1 className="font-bold text-center text-xl mb-6">Login</h1>
              <form onSubmit={(e) => handleSignIn(e)}>
                <InputField
                  icon={<MdEmail size={24} />}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value as string)}
                  required
                />
                <InputField
                  icon={<MdKey size={24} className="rotate-90" />}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value as string)}
                  required
                />
                <div className="w-full flex items-center justify-end text-xs">
                  <Link
                    to="/forgot-password"
                    className="hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PrimaryButton
                  type="submit"
                  content="Sign In"
                  isLoading={isLoading}
                  loadingText="Signing In..."
                />
              </form>
              <p className="w-full m-auto text-center my-2">OR</p>
              <button
                onClick={() => toast.success("Coming soon!")}
                className="w-full bg-secondary rounded-xl flex items-center hover:cursor-pointer hover:opacity-85 px-4 py-2 my-4"
              >
                <FcGoogle size={24} className="mr-3" />
                <p className="text-sm bg-transparent outline-none">
                  Login with Google
                </p>
              </button>
              <div className="w-full flex items-center justify-center text-sm">
                <p>Don't have an account?</p>
                <Link
                  to="/signup"
                  className="font-bold ml-1 cursor-pointer hover:underline"
                >
                  Sign Up!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
