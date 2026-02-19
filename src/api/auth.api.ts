import axiosInstance from "@/axios/axios-instance";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
}

export const loginApi = async (payload: LoginPayload) => {
  const response = await axiosInstance.post("/auth/login", payload);
  return response.data;
};

export const signupApi = async (payload: SignupPayload) => {
  const response = await axiosInstance.post("/auth/signup", payload);
  return response.data;
};
