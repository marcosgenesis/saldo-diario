import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  addDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Slot } from "radix-ui";
import {
  type ButtonHTMLAttributes,
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
  useContext,
} from "react";
// Context for sharing state between components
type Period = {
  startDate: Date;
  endDate: Date;
};

type MiniCalendarContextType = {
  selectedDate: Date | null | undefined;
  onDateSelect: (date: Date) => void;
  startDate: Date;
  onNavigate: (direction: "prev" | "next") => void;
  days: number;
  // Range selection
  selectedPeriod: Period | null;
  onSelectedPeriodChange: (period: Period) => void;
  selectionDays: number;
  // Visible constraint
  visiblePeriod?: Period;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
};
const MiniCalendarContext = createContext<MiniCalendarContextType | null>(null);
const useMiniCalendar = () => {
  const context = useContext(MiniCalendarContext);
  if (!context) {
    throw new Error("MiniCalendar components must be used within MiniCalendar");
  }
  return context;
};

// Helper function to get array of consecutive dates
const getDays = (startDate: Date, count: number): Date[] => {
  const days: Date[] = [];
  for (let i = 0; i < count; i++) {
    days.push(addDays(startDate, i));
  }
  return days;
};
// Helper function to format date
const formatDate = (date: Date) => {
  const month = format(date, "MMM", {
    locale: ptBR,
  });
  const day = format(date, "d", {
    locale: ptBR,
  });
  return { month, day };
};
export type MiniCalendarProps = HTMLAttributes<HTMLDivElement> & {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date | undefined) => void;
  startDate?: Date;
  defaultStartDate?: Date;
  onStartDateChange?: (date: Date | undefined) => void;
  days?: number;
  // Optional visible window constraint
  visiblePeriod?: Period;
  minDate?: Date;
  maxDate?: Date;
  // Fixed-length period selection config
  selectionDays?: number;
  selectedPeriod?: Period;
  defaultSelectedPeriod?: Period;
  onSelectedPeriodChange?: (period: Period | undefined) => void;
};
export const MiniCalendar = ({
  value,
  defaultValue,
  onValueChange,
  startDate,
  defaultStartDate = new Date(),
  onStartDateChange,
  days = 5,
  visiblePeriod: visiblePeriodProp,
  minDate,
  maxDate,
  selectionDays = 1,
  selectedPeriod,
  defaultSelectedPeriod,
  onSelectedPeriodChange,
  className,
  children,
  ...props
}: MiniCalendarProps) => {
  const [selectedDate, setSelectedDate] = useControllableState<
    Date | undefined
  >({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  const [currentStartDate, setCurrentStartDate] = useControllableState({
    prop: startDate,
    defaultProp: defaultStartDate,
    onChange: onStartDateChange,
  });
  const [currentSelectedPeriod, setCurrentSelectedPeriod] =
    useControllableState<Period | undefined>({
      prop: selectedPeriod,
      defaultProp: defaultSelectedPeriod,
      onChange: onSelectedPeriodChange,
    });

  // Normalize visible period using explicit prop or derived from min/max
  const visiblePeriod = visiblePeriodProp
    ? visiblePeriodProp
    : minDate && maxDate
      ? { startDate: minDate, endDate: maxDate }
      : undefined;

  const clampToVisible = (date: Date): Date => {
    if (!visiblePeriod) return date;
    if (isBefore(date, visiblePeriod.startDate)) return visiblePeriod.startDate;
    if (isAfter(date, visiblePeriod.endDate)) return visiblePeriod.endDate;
    return new Date(date);
  };

  const clampStartForWindow = (date: Date): Date => {
    if (!visiblePeriod) return date;
    // Ensure the window [date, date + days - 1] stays within visiblePeriod
    const maxStart = addDays(visiblePeriod.endDate, -(days - 1));
    if (isBefore(date, visiblePeriod.startDate)) return visiblePeriod.startDate;
    if (isAfter(date, maxStart)) return maxStart;
    return date;
  };
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // If selectionDays > 1, also set a period selection
    const start = clampToVisible(date);
    const unclampedEnd = addDays(start, Math.max(1, selectionDays) - 1);
    const end = clampToVisible(unclampedEnd);
    const period: Period = { startDate: start, endDate: unclampedEnd };
    setCurrentSelectedPeriod(period);
  };
  const handleNavigate = (direction: "prev" | "next") => {
    const newStartDate = addDays(
      currentStartDate || new Date(),
      direction === "next" ? days : -days
    );
    setCurrentStartDate(clampStartForWindow(newStartDate));
  };
  // Evaluate navigation availability within visiblePeriod window
  const effectiveStartDate = clampStartForWindow(
    currentStartDate || new Date()
  );
  const maxStartForWindow = visiblePeriod
    ? addDays(visiblePeriod.endDate, -(days - 1))
    : undefined;
  const canNavigatePrev = visiblePeriod
    ? isAfter(effectiveStartDate, visiblePeriod.startDate)
    : true;
  const canNavigateNext = visiblePeriod
    ? maxStartForWindow
      ? isBefore(effectiveStartDate, maxStartForWindow)
      : false
    : true;
  const contextValue: MiniCalendarContextType = {
    selectedDate: selectedDate || null,
    onDateSelect: handleDateSelect,
    startDate: clampStartForWindow(currentStartDate || new Date()),
    onNavigate: handleNavigate,
    days,
    selectedPeriod: currentSelectedPeriod || null,
    onSelectedPeriodChange: (p) => setCurrentSelectedPeriod(p),
    selectionDays,
    visiblePeriod,
    canNavigatePrev,
    canNavigateNext,
  };
  return (
    <MiniCalendarContext.Provider value={contextValue}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border bg-background p-2 w-full ",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </MiniCalendarContext.Provider>
  );
};
export type MiniCalendarNavigationProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    direction: "prev" | "next";
    asChild?: boolean;
  };
export const MiniCalendarNavigation = ({
  direction,
  asChild = false,
  children,
  onClick,
  ...props
}: MiniCalendarNavigationProps) => {
  const { onNavigate, canNavigatePrev, canNavigateNext } = useMiniCalendar();
  const Icon = direction === "prev" ? ChevronLeftIcon : ChevronRightIcon;
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    const isDisabled =
      direction === "prev" ? !canNavigatePrev : !canNavigateNext;
    if (isDisabled) return;
    onNavigate(direction);
    onClick?.(event);
  };
  const disabled = direction === "prev" ? !canNavigatePrev : !canNavigateNext;
  if (asChild) {
    return (
      <Slot.Root onClick={handleClick} aria-disabled={disabled} {...props}>
        {children}
      </Slot.Root>
    );
  }
  return (
    <Button
      onClick={handleClick}
      size={asChild ? undefined : "icon"}
      type="button"
      variant={asChild ? undefined : "ghost"}
      disabled={disabled}
      {...props}
    >
      {children ?? <Icon className="size-4" />}
    </Button>
  );
};
export type MiniCalendarDaysProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: (date: Date) => ReactNode;
};
export const MiniCalendarDays = ({
  className,
  children,
  ...props
}: MiniCalendarDaysProps) => {
  const { startDate, days: dayCount, visiblePeriod } = useMiniCalendar();
  let days = getDays(startDate, dayCount);
  if (visiblePeriod) {
    days = days.filter(
      (d) =>
        !isBefore(d, visiblePeriod.startDate) &&
        !isAfter(d, visiblePeriod.endDate)
    );
  }
  return (
    <div
      className={cn("flex items-center gap-1 justify-around w-full", className)}
      {...props}
    >
      {days.map((date) => children(date))}
    </div>
  );
};
export type MiniCalendarDayProps = ComponentProps<typeof Button> & {
  date: Date;
};

export const MiniCalendarDay = ({
  date,
  className,
  ...props
}: MiniCalendarDayProps) => {
  const { selectedDate, onDateSelect, selectedPeriod } = useMiniCalendar();
  const { month, day } = formatDate(date);
  const isSelected = selectedDate && isSameDay(date, selectedDate);
  const isInSelectedPeriod =
    selectedPeriod &&
    !isBefore(date, selectedPeriod.startDate) &&
    !isAfter(date, selectedPeriod.endDate);
  const isTodayDate = isToday(date);
  return (
    <Button
      className={cn(
        "h-auto w-full min-w-[3rem] flex-col gap-0 p-2 text-xs",
        isTodayDate && !isSelected && !isInSelectedPeriod && "bg-accent",
        className
      )}
      onClick={() => onDateSelect(date)}
      size="sm"
      type="button"
      variant={isSelected || isInSelectedPeriod ? "default" : "ghost"}
      {...props}
    >
      <span
        className={cn(
          "font-medium text-[10px] text-muted-foreground",
          (isSelected || isInSelectedPeriod) && "text-primary-foreground/70"
        )}
      >
        {month}
      </span>
      <span className="font-semibold text-sm">{day}</span>
    </Button>
  );
};
