import type { ButtonHTMLAttributes } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  content: string;
  loadingText?: string;
  isLoading?: boolean;
  loadingIcon?: React.ReactNode;
  isNegative?: boolean;
}

const PrimaryButton = ({
  icon,
  content,
  loadingText,
  isLoading = false,
  loadingIcon,
  type = "button",
  className = "",
  isNegative = false,
  ...rest
}: PrimaryButtonProps) => {
  return (
    <button
      type={type}
      disabled={isLoading || rest.disabled}
      className={`
        w-full ${isNegative ? "bg-semi-primary" : "bg-tertiary"} rounded-2xl font-bold py-2 my-2
        hover:opacity-85 hover:cursor-pointer
        disabled:opacity-60 disabled:cursor-not-allowed
        flex items-center flex-nowrap justify-center
        ${className}
      `}
      {...rest}
    >
      {(isLoading
        ? (loadingIcon ?? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ))
        : icon) && (
        <span className="mr-1 flex-none">
          {isLoading
            ? (loadingIcon ?? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ))
            : icon}
        </span>
      )}
      <span className="whitespace-nowrap">
        {isLoading ? loadingText || "Loading..." : content}
      </span>
    </button>
  );
};

export default PrimaryButton;
