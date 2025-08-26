import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from "./ui/mini-calendar";

export const PeriodSelector = () => {
  return (
    <MiniCalendar days={22}>
      <MiniCalendarNavigation direction="prev" />
      <MiniCalendarDays>
        {(date) => <MiniCalendarDay date={date} key={date.toISOString()} />}
      </MiniCalendarDays>
      <MiniCalendarNavigation direction="next" />
    </MiniCalendar>
  );
};
