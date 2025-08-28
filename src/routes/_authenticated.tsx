import Header from "@/components/header";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    console.log(context.auth.isAuthenticated);
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          // Save current location for redirect after login
          redirect: location.href,
        },
      });
    }
  },
  component: () => (
    <div>
      <Header />
      <Outlet />
    </div>
  ),
});
