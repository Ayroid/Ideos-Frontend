import { create } from "zustand";

type State = {
  isEnabled: boolean;
};

type Actions = {
  enableFocusMode: () => void;
  disableFocusMode: () => void;
};

type FocusModeStore = State & Actions;

export const useFocusModeStore = create<FocusModeStore>((set) => ({
  isEnabled: false,
  enableFocusMode: () => set({ isEnabled: true }),
  disableFocusMode: () => set({ isEnabled: false }),
}));

export { useFocusModeStore as useFocusMode };
export type { FocusModeStore };
