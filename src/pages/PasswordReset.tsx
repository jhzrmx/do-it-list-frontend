import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { useState } from "react";
import { MdLock, MdVerifiedUser } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";

const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleResetPassword = (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(`Password: ${password}`);
    console.log(`Confirm Password: ${confirmPassword}`);
    console.log(`Loading: ${isLoading}`);
    setLoading(false);
    navigate("/todo");
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
              <h1 className="font-bold text-center text-xl mb-6">
                Password Reset
              </h1>
              <form onSubmit={(e) => handleResetPassword(e)}>
                <InputField
                  icon={<MdLock size={24} />}
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                <PrimaryButton type="submit" content="Reset Password" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
