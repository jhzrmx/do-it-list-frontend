import { type FC, type ReactNode, useState } from "react";
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
  const [isVisible, setIsVisible] = useState(isOpen);

  if (isOpen && !isVisible) {
    setIsVisible(true);
  }

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={closeOnBackdropClick ? onClose : undefined}
        className={`
          absolute inset-0 bg-black/40 backdrop-blur-sm
          transition-opacity duration-200
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
      />

      <div
        onTransitionEnd={handleAnimationEnd}
        className={`
          relative z-10 w-2/3 max-w-md
          rounded-2xl bg-secondary shadow-2xl
          transition-all duration-200
          ${isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"}
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
