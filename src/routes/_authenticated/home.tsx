import { DailyBalanceColumns } from "@/components/daily-balance-columns";
import { InitialForm } from "@/components/initial-form";
import { PeriodSelector } from "@/components/period-selector";
import { RegistryModal } from "@/components/registry-modal";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Badge } from "@/components/ui/badge";
import { getLastBalances } from "@/queries/get-last-balances";
import { useBalanceStore as useBalanceStoreStore } from "@/stores/balance-store";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { endOfYear, startOfYear } from "date-fns";

export const Route = createFileRoute("/_authenticated/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const { balance, setBalance } = useBalanceStoreStore();

  const { data: lastBalances } = useQuery({
    queryKey: ["last-balances"],
    queryFn: async () => {
      const response = await getLastBalances({
        startDate: startOfYear(new Date()),
        endDate: endOfYear(new Date()),
      });
      if (response?.length) {
        setBalance(response[0]);
      }
      return response;
    },
  });

  if (!lastBalances?.length) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center py-8">
        <div className="max-w-7xl w-full px-4">
          <div className="max-w-md mx-auto">
            <InitialForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8">
      <div className="max-w-7xl w-full px-4">
        <div className="space-y-8">
          <div className="border rounded-lg">
            <AuroraBackground className="rounded-lg">
              <div className="flex justify-between items-center w-full sm:px-4 px-2">
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
