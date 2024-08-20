import { create } from "zustand";

type State = {
  isOpen: boolean;
};

type Actions = {
  open: () => void;
  close: () => void;
};

type PopupStore = State & Actions;

export const usePopupStore = create<PopupStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export { usePopupStore as usePopup };
export type { PopupStore };
