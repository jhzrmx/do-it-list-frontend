import axiosInstance from "@/axios/axios-instance";

export const sendResetPasswordEmailApi = async (email: string) => {
  const response = await axiosInstance.post("/forget-password/send-link", {
    email,
  });

  return response.data;
};

export const verifyResetTokenApi = async (token: string) => {
  const response = await axiosInstance.post("/forget-password/verify-link", {
    token,
  });

  return response.data;
};

export const resetPasswordApi = async (token: string, newPassword: string) => {
  const response = await axiosInstance.post(
    "/forget-password/change-password",
    {
      token,
      newPassword,
    },
  );

  return response.data;
};
