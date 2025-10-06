import { DailyBalanceColumns } from "@/components/daily-balance-columns";
import { InitialForm } from "@/components/initial-form";
import { PeriodSelector } from "@/components/period-selector";
import { RegistryModal } from "@/components/registry-modal";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { fromUTC, getUserTimezone } from "@/lib/date-utils";
import { getTodayBalance } from "@/queries/get-today-balance";
import { useBalanceStore as useBalanceStoreStore } from "@/stores/balance-store";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/home")({
  component: RouteComponent,
  loader: async () => {
    const userTimezone = getUserTimezone();
    const response = await getTodayBalance();
    if (response) {
      const balance = {
        ...response,
        startDate: fromUTC(response.startDate, userTimezone),
        endDate: fromUTC(response.endDate, userTimezone),
        createdAt: fromUTC(response.createdAt, userTimezone),
      };
      useBalanceStoreStore.setState({
        balance: balance,
      });
    }
    return {
      initialBalance: response,
    };
  },
  errorComponent: ({ error }) => {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center py-8">
        <div className="max-w-7xl w-full px-4">
          <div className="max-w-md mx-auto">
            <InitialForm />
          </div>
        </div>
      </div>
    );
  },
});

function RouteComponent() {
  const { balance, setBalance } = useBalanceStoreStore();
  const { user } = useAuth();

  const balanceQuery = useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const userTimezone = getUserTimezone();
      const response = await getTodayBalance();
      if (response) {
        const balance = {
          ...response,
          startDate: fromUTC(response.startDate, userTimezone),
          endDate: fromUTC(response.endDate, userTimezone),
          createdAt: fromUTC(response.createdAt, userTimezone),
        };
        setBalance(balance);
      }
      return response;
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8">
      <div className="max-w-7xl w-full px-4">
        <div className="space-y-8">
          <div className="border rounded-lg">
            <AuroraBackground className="rounded-lg py-4">
              <div className="flex justify-between items-center w-full sm:px-4 px-2 md:flex-row flex-col gap-2">
                <div className="sm:p-4 p-1 flex flex-col gap-2 items-start justify-between w-full">
                  <span>
                    <p className="text-muted-foreground">Saldo Diário</p>
                    <p className="text-3xl font-semibold  tabular-nums text-gray-900">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(balance?.dailyBalanceToday ?? 0)}
                    </p>
                  </span>
                  <Badge variant="outline" className="gap-1.5 bg-white">
                    <span
                      className="size-1.5 rounded-full bg-emerald-500"
                      aria-hidden="true"
                    ></span>
                    {`Saldo restante desde período é  ${new Intl.NumberFormat(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    ).format(balance?.totalRemainingUntilToday ?? 0)}`}
                  </Badge>
                </div>
                <RegistryModal />
              </div>
            </AuroraBackground>
          </div>
          <PeriodSelector />

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Histórico de dias</h2>
              </div>
              <DailyBalanceColumns />
            </div>

            {/* <FutureProjections
                  projections={futureProjections}
                  currentPage={currentProjectionPage}
                  totalPages={totalProjectionPages}
                  onPageChange={setProjectionPage}
                /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
