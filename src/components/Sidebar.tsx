import axiosInstance from "@/axios/axios-instance";
import { useAuthStore } from "@/stores/auth.store";
import { AxiosError } from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaRegCircleUser } from "react-icons/fa6";
import PrimaryButton from "./PrimaryButton";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [isLoading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/logout");

      toast.success("Logout successful");
      window.location.href = "/";
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;

      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Login failed! Please try again.");
      }

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

        <div className="px-6 space-y-6 text-sm font-medium">
          <p className="cursor-pointer hover:text-red-400">My Todo</p>
          <p className="cursor-pointer hover:text-red-400">Edit Profile</p>
          <p className="cursor-pointer hover:text-red-400">
            View Terms and Conditions
          </p>
          <p className="cursor-pointer hover:text-red-400">About Do it list!</p>
        </div>

        <div className="absolute bottom-10 left-0 w-full px-6">
          <PrimaryButton
            content="Logout"
            loadingText="Logging out..."
            onClick={logout}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
