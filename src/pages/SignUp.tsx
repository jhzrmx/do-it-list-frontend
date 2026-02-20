import axiosInstance from "@/axios/axios-instance";
import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import validatePassword from "@/utils/validate-password";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdEmail, MdLock, MdPerson, MdVerifiedUser } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";

/**
 * SignUp component renders the user registration form.
 * Handles user input validation, form submission, and navigation to terms and conditions upon successful signup.
 */
const SignUp = () => {
  /**
   * State for storing form input values and UI state.
   */
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const navigate = useNavigate();

  /**
   * Handles the sign-up form submission.
   * Validates password strength and confirmation, sends signup request to backend,
   * and navigates to terms and conditions page on success.
   * @param e - The form submit event
   */
  const handleSignUp = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const passwordError = validatePassword(password);
    const confirmError =
      password !== confirmPassword ? "Passwords do not match" : "";

    if (passwordError || confirmError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmError,
      });
      if (passwordError) toast.error(passwordError);
      if (confirmError) toast.error(confirmError);
      return;
    }
    setLoading(true);
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

  /**
   * Renders the sign-up form UI including logo, form fields, validation errors, and navigation links.
   */
  return (
    // Main container with full height and primary background
    <div>
      <div className="w-full h-dvh bg-primary flex items-center justify-center">
        {/* Card container with secondary background and rounded corners */}
        <div className="w-full h-[85dvh] bg-secondary rounded-tl-4xl rounded-br-4xl flex items-center justify-center">
          <div className="flex flex-col">
            {/* Logo and title section*/}
            <div className="w-full flex justify-center items-center">
              <img src={Logo} className="w-28" />
              <h1 className="font-bold text-4xl text-primary text-center m-4">
                Do it list!
              </h1>
            </div>
            {/* Form container with semi-primary background and padding */}
            <div className="w-full bg-semi-primary rounded-4xl p-6 mt-8">
              <h1 className="font-bold text-center text-xl mb-6">Sign Up</h1>
              <form onSubmit={(e) => handleSignUp(e)}>
                {/* Full name input field with person icon */}
                <InputField
                  icon={<MdPerson size={24} />}
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value as string)}
                  required
                />
                {/* Email input field */}
                <InputField
                  icon={<MdEmail size={24} />}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value as string)}
                  required
                />
                {/* Password input field with real-time validation */}
                <InputField
                  icon={<MdLock size={24} />}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value as string;
                    setPassword(value);
                    const passwordError = validatePassword(value);
                    setErrors((prev) => ({
                      ...prev,
                      password: passwordError,
                    }));
                  }}
                  required
                />
                {/* Display password validation error if any */}
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
                {/* Confirm password input field with real-time validation */}
                <InputField
                  icon={<MdVerifiedUser size={24} />}
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    const value = e.target.value as string;
                    setConfirmPassword(value);
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword:
                        value !== password ? "Passwords do not match" : "",
                    }));
                  }}
                  required
                />
                {/* Display confirm password error */}
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs pb-1">
                    {errors.confirmPassword}
                  </p>
                )}
                {/* Submit button with loading state */}
                <PrimaryButton
                  type="submit"
                  content="Create Account"
                  isLoading={isLoading}
                  loadingText="Creating..."
                />
              </form>
              {/* Link to login page for existing users */}
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
