import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { useState } from "react";
import { MdEmail, MdSend } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";

const TermsAndCond = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendEmail = (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log(`Email: ${email}`);
    navigate("/password-reset");
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
