import { createRouter } from "@tanstack/react-router";
import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";
import { routeTree } from "./routeTree.gen";

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();

export const router = createRouter({
  routeTree,
  context: {
    // auth will be passed down from App component
    auth: undefined!,
    ...TanStackQueryProviderContext,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
