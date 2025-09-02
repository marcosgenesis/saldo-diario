import { create } from "zustand";

type Period = {
  startDate: Date;
  endDate: Date;
};

interface PeriodStore {
  period: Period | null;
  setPeriod: (period: Period) => void;
}

export const usePeriodStore = create<PeriodStore>((set) => ({
  period: null,
  setPeriod: (period: Period) => set({ period }),
}));