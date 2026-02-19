import { type FC, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = "",
}) => {
  return createPortal(
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-opacity duration-200
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
    >
      <div
        onClick={closeOnBackdropClick ? onClose : undefined}
        className={`
          absolute inset-0 bg-black/50
          transition-opacity duration-200
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
      />

      <div
        className={`
          relative z-10 w-2/3 max-w-md
          rounded-2xl bg-secondary shadow-2xl
          transform transition-all duration-200
          ${isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"}
          ${className}
        `}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white rounded-full bg-primary p-1 transition cursor-pointer hover:opacity-75"
          >
            <MdClose size={22} />
          </button>
        )}

        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
