import type { InputHTMLAttributes } from "react";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  type?: "text" | "email" | "password" | "number" | "search";
  bgColorClass?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  type = "text",
  placeholder,
  bgColorClass = "bg-secondary",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div
      className={`w-full ${bgColorClass} rounded-xl flex items-center px-4 py-2 my-4`}
    >
      {icon && <span className="mr-3">{icon}</span>}
      <input
        type={inputType}
        placeholder={placeholder}
        className="w-full text-sm bg-transparent outline-none"
        {...rest}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="ml-3 cursor-pointer"
        >
          {showPassword ? (
            <AiFillEye size={18} />
          ) : (
            <AiFillEyeInvisible size={18} />
          )}
        </button>
      )}
    </div>
  );
};

export default InputField;
