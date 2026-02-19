import axiosInstance from "@/axios/axios-instance";

export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  imageUrl?: string | null;
  deleteImage?: boolean | null;
}

export const updateUserApi = async (payload: UpdateUserPayload) => {
  const response = await axiosInstance.put("/me", payload);
  return response.data;
};

export const deleteAccountApi = async () => {
  const response = await axiosInstance.delete("/me");
  return response.data;
};
