import axiosInstance from "@/axios/axios-instance";
import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdEmail, MdSend } from "react-icons/md";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";

const TermsAndCond = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleSendEmail = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/forget-password/send-link", {
        email,
      });

      toast.success(
        response?.data?.message ||
          "Password reset link has been sent to your email.",
      );
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message ||
          "Sending failed! Please try again.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-dvh bg-primary flex items-center justify-center">
      <div className="w-full h-[85dvh] bg-secondary rounded-tl-4xl rounded-br-4xl flex items-center justify-center">
        <div className="flex flex-col items-center w-full max-w-sm px-4">
          <div className="flex flex-row items-center">
            <img src={Logo} className="w-28" />
            <h1 className="font-bold text-4xl text-primary text-center m-4">
              Do it list!
            </h1>
          </div>
          <div className="w-full bg-semi-primary rounded-4xl p-6 mt-8">
            <h1 className="font-bold text-center text-xl mb-6">
              Forget Password
            </h1>
            <p className="my-4 text-sm text-center">
              We will send you a password reset link to your email
            </p>
            <form onSubmit={(e) => handleSendEmail(e)}>
              <InputField
                icon={<MdEmail size={24} />}
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <PrimaryButton
                type="submit"
                content="Send Password Reset Link"
                loadingText="Sending..."
                isLoading={isLoading}
                icon={<MdSend />}
              />
            </form>
            <div className="w-full flex items-center justify-center mt-8 text-sm">
              <Link to="/login" className="ml-1 cursor-pointer">
                Go back to login page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndCond;
