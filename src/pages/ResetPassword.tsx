import axiosInstance from "@/axios/axios-instance";
import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdLock, MdVerifiedUser } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";
import Logo from "../assets/logo.svg";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const hasVerified = useRef(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token || hasVerified.current) return;

    hasVerified.current = true;
    checkToken(token);
  }, [token]);

  const checkToken = async (token: string) => {
    try {
      await axiosInstance.post("/forget-password/verify-link", {
        token,
      });

      setIsTokenValid(true);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Invalid or expired reset link.",
      );
      setIsTokenValid(false);
    }
  };

  const handleResetPassword = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset link.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/forget-password/change-password", {
        token,
        newPassword,
      });

      toast.success("Password reset successful!");
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 1000);

      return () => clearTimeout(timer);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message ||
          "Password reset failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isTokenValid === false) {
    return (
      <div className="w-full h-dvh flex flex-col items-center justify-center bg-secondary">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Reset Link Expired
        </h1>
        <p className="m-2 text-sm text-center">
          This password reset link is invalid or has expired. Please request a
          new password reset to continue.
        </p>
        <Link
          to="/forgot-password"
          className="px-3 py-2 my-2 text-sm bg-primary text-secondary rounded-lg hover:opacity-80 transition-colors"
        >
          Request New Link
        </Link>
        <Link
          to="/"
          className="px-3 py-2 text-sm text-primary rounded-lg hover:underline transition-colors"
        >
          Go home instead
        </Link>
      </div>
    );
  }

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
              <h1 className="font-bold text-center text-xl mb-6">
                Password Reset
              </h1>
              <form onSubmit={(e) => handleResetPassword(e)}>
                <InputField
                  icon={<MdLock size={24} />}
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <InputField
                  icon={<MdVerifiedUser size={24} />}
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <PrimaryButton
                  type="submit"
                  content="Reset Password"
                  loadingText="Resetting"
                  isLoading={isLoading}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
