import axiosInstance from "@/axios/axios-instance";
import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import validatePassword from "@/utils/validate-password";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdLock, MdVerifiedUser } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";
import Logo from "../assets/logo.svg";

/**
 * ResetPassword component handles the password reset functionality.
 * It verifies the reset token from URL parameters and allows users to set a new password.
 */
const ResetPassword = () => {
  // State for form inputs
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  // State to track if the reset token is valid
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  // State for form validation errors
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  // Ref to prevent multiple token verifications
  const hasVerified = useRef(false);

  // Extract token from URL search parameters
  const token = searchParams.get("token");

  // Effect to verify the reset token on component mount
  useEffect(() => {
    if (!token || hasVerified.current) return;

    hasVerified.current = true;
    checkToken(token);
  }, [token]);

  /**
   * Verifies the password reset token by making an API call.
   * @param token - The reset token from the URL
   */
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

  /**
   * Handles the password reset form submission.
   * Validates passwords and makes API call to change password.
   * @param e - The form submit event
   */
  const handleResetPassword = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset link.");
      return;
    }

    // Validate new password
    const passwordError = validatePassword(newPassword);
    // Check if passwords match
    const confirmError =
      newPassword !== confirmPassword ? "Passwords do not match" : "";

    if (passwordError || confirmError) {
      setErrors({
        newPassword: passwordError,
        confirmPassword: confirmError,
      });
      if (passwordError) toast.error(passwordError);
      if (confirmError) toast.error(confirmError);
      return;
    }
    setLoading(true);

    try {
      await axiosInstance.post("/forget-password/change-password", {
        token,
        newPassword,
      });

      toast.success("Password reset successful!");
      // Redirect to home page after success
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

  // Render error screen if token is invalid
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

  // Main reset password form UI
  return (
    <div>
      <div className="w-full h-dvh bg-primary flex items-center justify-center">
        <div className="w-full h-[85dvh] bg-secondary rounded-tl-4xl rounded-br-4xl flex items-center justify-center">
          <div className="flex flex-col">
            {/* Logo and title section */}
            <div className="w-full flex justify-center items-center">
              <img src={Logo} className="w-28" />
              <h1 className="font-bold text-4xl text-primary text-center m-4">
                Do it list!
              </h1>
            </div>
            {/* Password reset form container */}
            <div className="w-full bg-semi-primary rounded-4xl p-6 mt-8">
              <h1 className="font-bold text-center text-xl mb-6">
                Password Reset
              </h1>
              <form onSubmit={(e) => handleResetPassword(e)}>
                {/* New password input field */}
                <InputField
                  icon={<MdLock size={24} />}
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    const value = e.target.value as string;
                    setNewPassword(value);
                    const passwordError = validatePassword(value);
                    setErrors((prev) => ({
                      ...prev,
                      newPassword: passwordError,
                    }));
                  }}
                  required
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-xs">{errors.newPassword}</p>
                )}
                {/* Confirm password input field */}
                <InputField
                  icon={<MdVerifiedUser size={24} />}
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    const value = e.target.value as string;
                    setConfirmPassword(value);
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword:
                        value !== newPassword ? "Passwords do not match" : "",
                    }));
                  }}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs pb-1">
                    {errors.confirmPassword}
                  </p>
                )}
                {/* Submit button */}
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
