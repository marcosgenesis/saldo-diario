import { api, type SuccessResponse } from "@/services/api";

export const getBalanceByDate = async (date?: Date) => {
  const searchParams = new URLSearchParams();
  if (date) {
    searchParams.set("date", date.toISOString());
  }

  const response = await api
    .get<
      SuccessResponse<{
        id: string;
        amount: number;
        startDate: Date;
        endDate: Date;
        paymentDate: Date;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        dailyBalanceToday: number;
        totalRemainingUntilToday: number;
      }>
    >(`api/balance${searchParams.toString() ? `?${searchParams.toString()}` : ""}`)
    .json();

  const { data } = response;
  return data;
};
