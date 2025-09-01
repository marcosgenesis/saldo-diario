import { api, type SuccessResponse } from "@/services/api";
import { z } from "zod";

const createBalanceSchema = z.object({
  amount: z.number(),
  startDate: z.date(),
  endDate: z.date(),
});

export type CreateBalanceSchema = z.infer<typeof createBalanceSchema>;

export const createBalance = async (data: CreateBalanceSchema) => {
  const { amount, startDate, endDate } = data;
  const response = await api.post<SuccessResponse<CreateBalanceSchema>>("api/balance", {
    json: {
      amount,
      startDate: startDate.toUTCString(),
      endDate: endDate.toUTCString(),
    }
  });
  return response.json();
};