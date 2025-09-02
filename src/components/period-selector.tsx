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
  const { setPeriod } = usePeriodStore();

  return (
    <MiniCalendar
      days={5}
      selectionDays={3}
      minDate={balance?.startDate}
      maxDate={balance?.endDate}
      onSelectedPeriodChange={(period) => {
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
