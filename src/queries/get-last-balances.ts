import { getUserTimezone, toISOStringInTimezone } from "@/lib/date-utils";
import { api, type SuccessResponse } from "@/services/api";

export const getLastBalances = async ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  try {
    const userTimezone = getUserTimezone();

    const response = await api
      .get<
        SuccessResponse<
          {
            id: string;
            amount: number;
            startDate: Date;
            endDate: Date;
            paymentDate: Date;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
          }[]
        >
      >("api/balance/find/period", {
        searchParams: {
          startDate: toISOStringInTimezone(startDate, userTimezone),
          endDate: toISOStringInTimezone(endDate, userTimezone),
        },
      })
      .json();

    const { data } = response;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
