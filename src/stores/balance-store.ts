import { create } from "zustand";

export type Balance = {
  id: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  dailyBalanceToday?: number;
  totalRemainingUntilToday?: number;
};

interface BalanceStore {
  balance: Balance | null;
  setBalance: (balance: Balance) => void;
}

export const useBalanceStore = create<BalanceStore>((set) => ({
  balance: null,
  setBalance: (balance: Balance) => set({ balance }),
}));
