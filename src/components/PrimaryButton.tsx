import type { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  content: string;
}

const PrimaryButton = ({
  icon,
  content,
  type = "button",
  className = "",
  ...rest
}: PrimaryButtonProps) => {
  return (
    <button
      type={type}
      className={` w-full bg-tertiary rounded-2xl font-bold py-2 my-2 hover:opacity-85 hover:cursor-pointer disabled:opacity-60  disabled:cursor-not-allowed flex items-center flex-nowrap justify-center
        ${className}
      `}
      {...rest}
    >
      {icon && <span className="mr-1 flex-none">{icon}</span>}
      <span className="whitespace-nowrap">{content}</span>
    </button>
  );
};

export default PrimaryButton;
