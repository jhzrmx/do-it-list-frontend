import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { useState } from "react";
import { MdEmail, MdKey, MdPerson, MdVerifiedUser } from "react-icons/md";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSignUp = (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Loading: ${isLoading}`);
    setLoading(false);
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
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <InputField
                  icon={<MdEmail size={24} />}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <InputField
                  icon={<MdKey size={24} className="rotate-90" />}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <InputField
                  icon={<MdVerifiedUser size={24} />}
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <PrimaryButton type="submit" content="Create Account" />
              </form>
              <div className="w-full flex items-center justify-center mt-2 text-sm">
                <p>Already have an account?</p>
                <Link to="/login" className="font-bold ml-1 cursor-pointer">
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
