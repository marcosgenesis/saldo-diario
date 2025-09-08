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
  const userTimezone = getUserTimezone();

  const minDate = balance?.startDate
    ? fromUTC(balance.startDate, userTimezone)
    : undefined;
  const maxDate = balance?.endDate
    ? fromUTC(balance.endDate, userTimezone)
    : undefined;

  return (
    <MiniCalendar
      days={5}
      selectionDays={3}
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
