import axiosInstance from "@/axios/axios-instance";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthState {
  user: User | null;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me", {
        withCredentials: true,
      });
      set({ user: res.data.user });
    } catch {
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
    set({ user: null });
  },
}));
