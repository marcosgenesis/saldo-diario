import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";
import { router } from "./router";
const TanStackQueryProviderContext = TanStackQueryProvider.getContext();

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

const queryClient = new QueryClient();
function App() {
  return (
    <StrictMode>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
            <InnerApp />
            <Toaster />
          </TanStackQueryProvider.Provider>
        </QueryClientProvider>
      </AuthProvider>
    </StrictMode>
  );
}

export default App;
