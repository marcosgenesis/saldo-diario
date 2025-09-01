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

export const createTransaction = async (transaction: CreateTransactionSchema) => {
  if(transaction.type === "income"){
    const response = await api.post<SuccessResponse<CreateTransactionSchema>>("api/income", {
      json: {
        ...transaction,
        date: new Date(transaction.date).toUTCString(),
      },
    }).json();
    return response.data;
  }else{
    const response = await api.post<SuccessResponse<CreateTransactionSchema>>("api/expense", {
      json: {
        ...transaction,
        date: new Date(transaction.date).toUTCString(),
      },
    }).json();
    return response.data;
  }
}