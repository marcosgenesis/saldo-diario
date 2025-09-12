import { useDeviceDetection } from "@/hooks/use-device-detection";
import { fromUTC, getUserTimezone } from "@/lib/date-utils";
import { useBalanceStore } from "@/stores/balance-store";
import { usePeriodStore } from "@/stores/period-store";
import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from "./ui/mini-calendar";

export const PeriodSelector = () => {
  const { balance } = useBalanceStore();
  const { setPeriod, period } = usePeriodStore();
  const { isMobileOrPWA } = useDeviceDetection();
  const userTimezone = getUserTimezone();

  const minDate = balance?.startDate
    ? fromUTC(balance.startDate, userTimezone)
    : undefined;
  const maxDate = balance?.endDate
    ? fromUTC(balance.endDate, userTimezone)
    : undefined;

  // Configurações baseadas no dispositivo
  const selectionDays = isMobileOrPWA ? 1 : 3;
  const displayDays = isMobileOrPWA ? 3 : 5;

  return (
    <MiniCalendar
      days={displayDays}
      selectionDays={selectionDays}
      minDate={minDate}
      maxDate={maxDate}
      defaultValue={
        period?.startDate
          ? (fromUTC(period.startDate, userTimezone) as any)
          : undefined
      }
      defaultSelectedPeriod={period ?? undefined}
      onSelectedPeriodChange={(period) => {
        console.log({ period });
        if (period) setPeriod(period);
      }}
    >
      <MiniCalendarNavigation direction="prev" />
      <MiniCalendarDays>
        {(date) => <MiniCalendarDay date={date} key={date.toISOString()} />}
      </MiniCalendarDays>
      <MiniCalendarNavigation direction="next" />
    </MiniCalendar>
  );
};
