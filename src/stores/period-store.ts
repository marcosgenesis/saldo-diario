import { addDays, endOfDay, startOfDay } from "date-fns";
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
  period: {
    startDate: startOfDay(new Date()),
    endDate: addDays(endOfDay(new Date()), 2),
  },
  setPeriod: (period: Period) => set({ period }),
}));
