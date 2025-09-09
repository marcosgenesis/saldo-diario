import { router } from "@/router";
import { authClient } from "@/services/auth-client";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Restore auth state on app load
  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies["@saldo-diario/token"];
    authClient.getSession().then((session) => {
      console.log(session);
      if (session.data?.session) {
        setUser(session.data.user);
        setIsAuthenticated(true);
        setIsLoading(false);
      } else if (token) {
        setIsAuthenticated(false);
        setIsLoading(false);
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });
  }, []);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const login = async (email: string, password: string) => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: (_ctx) => {
          setIsLoading(true);
        },
        onResponse: (_ctx) => {
          setIsLoading(false);
        },
        onSuccess: (ctx) => {
          const authToken = ctx.response.headers.get("set-auth-token"); // get the token from the response headers
          // Store the token securely
          setCookie(null, "@saldo-diario/token", authToken || "", {
            path: "/",
            maxAge: 60 * 60 * 24 * 1,
          });
          setIsAuthenticated(true);
          setUser(ctx.data.user);
          router.navigate({ to: "/home" });
        },
      }
    );
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    destroyCookie(null, "@saldo-diario/token");
    authClient.signOut();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
