import axiosInstance from "@/axios/axios-instance";
import InputField from "@/components/InputField";
import {
  default as ChangePasswordModal,
  default as DeleteAccountModal,
  default as EditEmailModal,
  default as EditNameModal,
} from "@/components/Modal";
import PrimaryButton from "@/components/PrimaryButton";
import Sidebar from "@/components/Sidebar";
import { useAuthStore } from "@/stores/auth.store";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaUserEdit } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdKey, MdLock, MdMenu, MdVerifiedUser } from "react-icons/md";

const Profile = () => {
  const { user, onUpdateUser } = useAuthStore();
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isEditNameModalOpen, setEditNameModalOpen] = useState<boolean>(false);
  const [isEditEmailModalOpen, setEditEmailModalOpen] =
    useState<boolean>(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] =
    useState<boolean>(false);
  const [isDeleteAccountModalOpen, setDeleteAccountModalOpen] =
    useState<boolean>(false);

  const [fullName, setFullName] = useState<string | undefined>(user?.fullName);
  const [email, setEmail] = useState<string | undefined>(user?.email);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const updateUser = async (user: object): Promise<boolean> => {
    try {
      await axiosInstance.put("/me", user);
      toast.success("Information updated successfully");
      onUpdateUser(user);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "An error ocured");
      console.error(err);
    }
    return false;
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      await axiosInstance.delete("/me");
      toast.success("Information updated successfully");
      window.location.href = "/";
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Account deletion failed",
      );
      console.error(err);
    }
    return false;
  };

  return (
    <>
      <EditNameModal
        isOpen={isEditNameModalOpen}
        onClose={() => {
          setFullName(user?.fullName);
          setEditNameModalOpen(false);
        }}
      >
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold my-4">Edit Name</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUser({ fullName });
              setEditNameModalOpen(false);
            }}
          >
            <input
              placeholder="Enter new name"
              className="w-full px-4 py-2 my-2 rounded-lg bg-white"
              value={fullName}
              onChange={(e) => setFullName(e.target.value as string)}
              required
            />

            <PrimaryButton content="Update" type="submit" />
          </form>

          <button
            onClick={() => {
              setFullName(user?.fullName);
              setEditNameModalOpen(false);
            }}
            className="text-sm cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </EditNameModal>
      <EditEmailModal
        isOpen={isEditEmailModalOpen}
        onClose={() => {
          setEmail(user?.email);
          setEditEmailModalOpen(false);
        }}
      >
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold my-4">Edit Email</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUser({ email }).then((successful) => {
                if (successful) {
                  setEditEmailModalOpen(false);
                }
              });
            }}
          >
            <input
              type="email"
              placeholder="Enter new email"
              className="w-full px-4 py-2 my-2 rounded-lg bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value as string)}
              required
            />

            <PrimaryButton content="Update" type="submit" />
          </form>

          <button
            onClick={() => {
              setEmail(user?.email);
              setEditEmailModalOpen(false);
            }}
            className="text-sm cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </EditEmailModal>
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      >
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold my-4">Change Password</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newPassword != confirmPassword) {
                toast.error("Passwords do not match.");
                return;
              }
              updateUser({ oldPassword, newPassword }).then((successful) => {
                if (successful) {
                  setChangePasswordModalOpen(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }
              });
            }}
          >
            <InputField
              icon={<MdKey size={24} className="rotate-90" />}
              type="password"
              placeholder="Enter old password"
              bgColorClass="bg-white"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value as string)}
              required
            />
            <InputField
              icon={<MdLock size={24} />}
              type="password"
              placeholder="Enter new password"
              bgColorClass="bg-white"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value as string)}
              required
            />
            <InputField
              icon={<MdVerifiedUser size={24} />}
              type="password"
              placeholder="Confirm password"
              bgColorClass="bg-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value as string)}
              required
            />

            <PrimaryButton content="Update" type="submit" />
          </form>

          <button
            onClick={() => setChangePasswordModalOpen(false)}
            className="text-sm cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </ChangePasswordModal>
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setDeleteAccountModalOpen(false)}
      >
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold my-4">Delete account?</h2>
          <div className="my-12 text-sm">
            You’ll lose access to your account and it’s data
          </div>
          <PrimaryButton
            content="Delete Account"
            onClick={deleteAccount}
            isNegative={true}
          />
          <PrimaryButton
            content="Cancel"
            onClick={() => setDeleteAccountModalOpen(false)}
          />
        </div>
      </DeleteAccountModal>

      <div className="h-dvh flex bg-primary overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-6 py-6 flex items-center">
            <button
              className="text-white cursor-pointer lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <MdMenu size={24} />
            </button>

            <div className="flex-1 text-center text-white">
              <h1 className="text-3xl font-bold">My Profile</h1>
            </div>
          </div>

          <div className="bg-secondary flex-1 rounded-t-4xl overflow-y-auto">
            <div className="max-w-xl mx-auto px-6 py-10 flex flex-col items-center">
              <div className="flex flex-col items-center py-10">
                <FaRegCircleUser size={128} className="text-primary" />
                <h2 className="mt-4 text-primary font-semibold text-lg">
                  {fullName}
                </h2>
              </div>
              <button
                onClick={() => setEditNameModalOpen(true)}
                className="w-1/2 bg-white rounded-xl flex items-center shadow transition hover:cursor-pointer hover:opacity-85 px-4 py-2 my-2"
              >
                <FaUserEdit size={24} className="mr-3" />
                <p className="text-sm bg-transparent outline-none">Edit Name</p>
              </button>
              <button
                onClick={() => setEditEmailModalOpen(true)}
                className="w-1/2 bg-white rounded-xl flex items-center shadow transition hover:cursor-pointer hover:opacity-85 px-4 py-2 my-2"
              >
                <FaUserEdit size={24} className="mr-3" />
                <p className="text-sm bg-transparent outline-none">
                  Edit Email
                </p>
              </button>
              <button
                onClick={() => setChangePasswordModalOpen(true)}
                className="w-1/2 bg-tertiary text-sm font-bold text-center rounded-xl shadow transition hover:cursor-pointer hover:opacity-85 px-4 py-3 my-2"
              >
                Change Password
              </button>
              <button
                onClick={() => setDeleteAccountModalOpen(true)}
                className="w-1/2 bg-primary text-sm font-bold text-center rounded-xl shadow transition hover:cursor-pointer hover:opacity-85 px-4 py-3 my-2"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
