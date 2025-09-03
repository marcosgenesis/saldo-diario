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

  return (
    <MiniCalendar
      days={5}
      selectionDays={3}
      minDate={balance?.startDate ? new Date(balance.startDate) : undefined}
      maxDate={balance?.endDate ? new Date(balance.endDate) : undefined}
      defaultValue={
        period?.startDate ? (new Date(period.startDate) as any) : undefined
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
