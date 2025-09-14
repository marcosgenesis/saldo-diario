import { getUserTimezone, toISOStringInTimezone } from "@/lib/date-utils";
import { api, type SuccessResponse } from "@/services/api";
import z from "zod";

export const createTransactionSchema = z.object({
  amount: z.number().min(1),
  description: z.string().min(1),
  date: z.date(),
  type: z.enum(["income", "expense"]),
  balanceId: z.string(),
});

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;

export const createTransaction = async (
  transaction: CreateTransactionSchema
) => {
  try {
    const userTimezone = getUserTimezone();
    const transactionData = {
      ...transaction,
      date: toISOStringInTimezone(transaction.date, userTimezone),
    };

    if (transaction.type === "income") {
      const response = await api
        .post<SuccessResponse<CreateTransactionSchema>>("api/income", {
          json: transactionData,
        })
        .json();
      return response.data;
    } else {
      const response = await api
        .post<SuccessResponse<CreateTransactionSchema>>("api/expense", {
          json: transactionData,
        })
        .json();
      return response.data;
    }
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
