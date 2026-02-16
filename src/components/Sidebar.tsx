import {
  default as AboutModal,
  default as LogoutModal,
  default as TCModal,
} from "@/components/Modal";
import { useAuthStore } from "@/stores/auth.store";
import { AxiosError } from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaRegCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "./PrimaryButton";
import TermsContent from "./TermsContent";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, onLogout } = useAuthStore();
  const navigate = useNavigate();
  const [isTCModalOpen, setTCModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setAboutModalOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);

  const logout = async () => {
    setLogoutModalOpen(false);
    try {
      onLogout();
      toast.success("Logout successful");
      window.location.href = "/";
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;

      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Logout failed! Please try again.");
      }
      console.error(err);
    }
  };

  return (
    <>
      <TCModal isOpen={isTCModalOpen} onClose={() => setTCModalOpen(false)}>
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold my-4">Terms and Conditions</h2>
          <TermsContent />
        </div>
      </TCModal>

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      >
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold my-4">About Do it List!</h2>
          <div className="my-12 text-sm">Nothing to display right now</div>
          <PrimaryButton
            content="OK"
            onClick={() => setAboutModalOpen(false)}
            className="text-sm cursor-pointer"
          />
        </div>
      </AboutModal>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
      >
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold my-4">Logout?</h2>
          <div className="my-12 text-sm">
            You can login to your account at anytime
          </div>
          <PrimaryButton
            content="Logout"
            isNegative={true}
            onClick={() => logout()}
          />
          <PrimaryButton
            content="Cancel"
            onClick={() => setLogoutModalOpen(false)}
          />
        </div>
      </LogoutModal>

      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-linear-to-b from-orange-200 to-gray-200 shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center py-10">
          <FaRegCircleUser size={96} className="text-primary" />
          <h2 className="mt-4 text-primary font-semibold text-lg">
            {user?.fullName}
          </h2>
        </div>

        <div className="px-6 space-y-6 text-sm font-bold">
          <button
            onClick={() => navigate("/todo")}
            className="w-full text-left cursor-pointer transition hover:text-primary"
          >
            My Todo
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="w-full text-left cursor-pointer transition hover:text-primary"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setTCModalOpen(true)}
            className="w-full text-left cursor-pointer transition hover:text-primary"
          >
            View Terms and Conditions
          </button>
          <button
            onClick={() => setAboutModalOpen(true)}
            className="w-full text-left cursor-pointer transition hover:text-primary"
          >
            About Do it list!
          </button>
        </div>

        <div className="absolute bottom-4 left-0 w-full px-6">
          <PrimaryButton
            content="Logout"
            className="shadow-md"
            onClick={() => setLogoutModalOpen(true)}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
