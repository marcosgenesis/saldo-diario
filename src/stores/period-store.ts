import { addDays } from "date-fns";
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
    startDate: new Date(),
    endDate: addDays(new Date(), 3),
  },
  setPeriod: (period: Period) => set({ period }),
}));
