import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL, // The base URL of your auth server
  fetchOptions: {
    credentials: "include",
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get("set-auth-token");
      console.log({ authToken });
      if (authToken) {
        localStorage.setItem("@saldo-diario/token", authToken);
      }
    },
    auth: {
      type: "Bearer",
      token: () => localStorage.getItem("@saldo-diario/token") || "", // get the token from localStorage
    },
  },
});
