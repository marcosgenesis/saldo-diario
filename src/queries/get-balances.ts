import { api, type SuccessResponse } from "@/services/api";
import type { Balance } from "@/stores/balance-store";

export const getBalances = async () => {
  const response = await api.get<SuccessResponse<Balance[]>>("api/balances");
  return response.json();
};
