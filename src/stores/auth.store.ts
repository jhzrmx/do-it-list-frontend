import axiosInstance from "@/axios/axios-instance";
import type User from "@/types/User";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  onLogout: () => Promise<void>;
  onUpdateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/me");
      set({ user: res.data.user });
    } catch {
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  onLogout: async () => {
    await axiosInstance.post("/auth/logout");
    localStorage.removeItem('authToken');
    set({ user: null });
  },

  onUpdateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}));
