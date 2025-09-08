import { api, type SuccessResponse } from "@/services/api";

export const getTodayBalance = async () => {
  try {
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
        }>
      >("api/balance/today")
      .json();

    const { data } = response;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
