import type { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  content: string;
}

const PrimaryButton = ({
  content,
  type = "button",
  className = "",
  ...rest
}: PrimaryButtonProps) => {
  return (
    <button
      type={type}
      className={`w-full bg-tertiary rounded-2xl font-bold py-2 my-2 hover:opacity-85 hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {content}
    </button>
  );
};

export default PrimaryButton;
