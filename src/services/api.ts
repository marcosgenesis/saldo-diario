import ky from "ky";

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  statusCode: number;
  timestamp: string;
}

// Função para obter o token de forma segura
function getAuthToken(): string | null {
  try {
    const token = localStorage.getItem("@saldo-diario/token");
    if (!token) {
      return null;
    }

    // Se o token já é uma string, retorna diretamente
    // Se for um JSON stringificado, faz o parse
    return typeof token === "string" ? token : JSON.parse(token);
  } catch (error) {
    console.error("Erro ao obter token de autenticação:", error);
    return null;
  }
}

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getAuthToken();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});
