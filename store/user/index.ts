import { User } from "@/types/user";
import { create } from "zustand";

type State = {
  user: User | null;
};

type Actions = {
  setUser: (user: User) => void;
  clearUser: () => void;
};

type UserStore = State & Actions;

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
