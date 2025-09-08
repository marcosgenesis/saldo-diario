import { getUserTimezone, toISOStringInTimezone } from "@/lib/date-utils";
import { api, type SuccessResponse } from "@/services/api";
interface Expense {
  id: string;
  amount: number;
  description: string;
  date: Date;
}

interface Income {
  id: string;
  amount: number;
  description: string;
  date: Date;
}

interface DailyBalance {
  date: Date;
  baseBalance: number;
  previousDayLeftover: number;
  expenses: Expense[];
  incomes: Income[];
  totalAvailable: number;
  remainingBalance: number;
}
export const getDailyBalances = async ({
  startDate,
  endDate,
  balanceId,
}: {
  startDate: Date;
  endDate: Date;
  balanceId: string;
}) => {
  const userTimezone = getUserTimezone();

  const response = await api
    .get<SuccessResponse<DailyBalance[]>>("api/balance/daily/period", {
      searchParams: {
        startDate: toISOStringInTimezone(startDate, userTimezone),
        endDate: toISOStringInTimezone(endDate, userTimezone),
        balanceId: balanceId,
      },
    })
    .json();
  const { data } = response;
  return data;
};
