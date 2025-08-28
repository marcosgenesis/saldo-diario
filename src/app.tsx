import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";
import { router } from "./router";
const TanStackQueryProviderContext = TanStackQueryProvider.getContext();

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <StrictMode>
      <AuthProvider>
        <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
          <InnerApp />
        </TanStackQueryProvider.Provider>
      </AuthProvider>
    </StrictMode>
  );
}

export default App;
