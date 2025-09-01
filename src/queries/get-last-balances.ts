import { api, type SuccessResponse } from "@/services/api";

export const getLastBalances = async ({startDate, endDate}: {startDate: Date, endDate: Date}) => {
  try {
    const response = await api.get<SuccessResponse<{
      id: string;
      amount: number;
      startDate: Date;
      endDate: Date;
      paymentDate: Date;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
    }[]>>("api/balance/find/period", {
      searchParams: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    }).json();

    const {data} = response;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
  
};