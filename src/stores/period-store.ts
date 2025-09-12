import { addDays, endOfDay, startOfDay } from "date-fns";
import { create } from "zustand";

type Period = {
  startDate: Date;
  endDate: Date;
};

interface PeriodStore {
  period: Period | null;
  setPeriod: (period: Period) => void;
  getDefaultPeriod: () => Period;
}

// Função para detectar mobile/PWA no lado do store
function isMobileOrPWA(): boolean {
  if (typeof window === "undefined") return false;

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768;

  const isPWA =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes("android-app://");

  return isMobile || isPWA;
}

function getDefaultPeriod(): Period {
  const today = new Date();
  const isMobileDevice = isMobileOrPWA();

  if (isMobileDevice) {
    // Mobile/PWA: período de 1 dia (apenas hoje)
    return {
      startDate: startOfDay(today),
      endDate: endOfDay(today),
    };
  } else {
    // Desktop: período de 3 dias (hoje + 2 dias)
    return {
      startDate: startOfDay(today),
      endDate: addDays(endOfDay(today), 2),
    };
  }
}

export const usePeriodStore = create<PeriodStore>((set) => ({
  period: getDefaultPeriod(),
  setPeriod: (period: Period) => set({ period }),
  getDefaultPeriod,
}));
