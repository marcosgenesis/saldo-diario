import { create } from "zustand";

interface RegistryModalState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  type: "income" | "expense";
  setType: (type: "income" | "expense") => void;
}
export const registryModalStore = create<RegistryModalState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  type: "expense",
  setType: (type: "income" | "expense") => set({ type }),
}));
