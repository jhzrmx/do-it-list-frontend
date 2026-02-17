import axiosInstance from "@/axios/axios-instance";
import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdEmail, MdLock, MdPerson, MdVerifiedUser } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";

const SignUp = () => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSignUp = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password != confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post("/auth/signup", {
        fullName,
        email,
        password,
      });

      toast.success("Account creation successful");
      navigate("/tc");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message ||
          "Account creation failed! Please try again.",
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
              <h1 className="font-bold text-center text-xl mb-6">Sign Up</h1>
              <form onSubmit={(e) => handleSignUp(e)}>
                <InputField
                  icon={<MdPerson size={24} />}
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value as string)}
                  required
                />
                <InputField
                  icon={<MdEmail size={24} />}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value as string)}
                  required
                />
                <InputField
                  icon={<MdLock size={24} />}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value as string)}
                  required
                />
                <InputField
                  icon={<MdVerifiedUser size={24} />}
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value as string)}
                  required
                />
                <PrimaryButton
                  type="submit"
                  content="Create Account"
                  isLoading={isLoading}
                  loadingText="Creating..."
                />
              </form>
              <div className="w-full flex items-center justify-center mt-4 text-sm">
                <p>Already have an account?</p>
                <Link
                  to="/login"
                  className="font-bold ml-1 cursor-pointer hover:underline"
                >
                  Sign In!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
