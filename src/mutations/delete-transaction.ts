import { api, type SuccessResponse } from "@/services/api";

export const deleteTransaction = async (
  id: string,
  type: "income" | "expense"
) => {
  try {
    const endpoint = type === "income" ? "api/income" : "api/expense";

    const response = await api
      .delete(`${endpoint}/${id}`)
      .json<SuccessResponse<null>>();

    return response.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
