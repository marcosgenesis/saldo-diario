import { DailyBalanceColumns } from "@/components/daily-balance-columns";
import { InitialForm } from "@/components/initial-form";
import { PeriodSelector } from "@/components/period-selector";
import { RegistryModal } from "@/components/registry-modal";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBalanceStore } from "@/stores/balance";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    setInitialData,
    dailyBalance,
    remainingBalance,
    paymentDate,
    addExpense,
    addIncome,
    deleteExpense,
    deleteIncome,
    displayedDays,
    futureProjections,
    currentPage,
    totalPages,
    currentProjectionPage,
    totalProjectionPages,
    setPage,
    setProjectionPage,
    reset,
  } = useBalanceStore();

  const handleInitialFormSubmit = (data: {
    balance: number;
    paymentDate: Date;
  }) => {
    setInitialData(data);
  };

  const handleExpenseSubmit = (data: {
    amount: number;
    description: string;
    date: Date;
  }) => {
    addExpense(data);
  };

  const handleIncomeSubmit = (data: {
    amount: number;
    description: string;
    date: Date;
  }) => {
    addIncome(data);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Tem certeza que deseja resetar todos os dados? Essa ação não pode ser desfeita."
      )
    ) {
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8">
      <div className="max-w-7xl w-full px-4">
        {!paymentDate ? (
          <div className="max-w-md mx-auto">
            <InitialForm onSubmit={handleInitialFormSubmit} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="border rounded-lg">
              <AuroraBackground className="rounded-lg">
                <div className="flex justify-between items-center w-full px-4">
                  <div className="p-4 flex flex-col gap-2 items-start justify-between w-full">
                    <span>
                      <p className="text-muted-foreground">Saldo Diário</p>
                      <p className="text-3xl font-semibold  tabular-nums text-gray-900">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(dailyBalance)}
                      </p>
                    </span>
                    <Badge variant="outline" className="gap-1.5 bg-white">
                      <span
                        className="size-1.5 rounded-full bg-emerald-500"
                        aria-hidden="true"
                      ></span>
                      {`Seu saldo restante até o próximo pagamento é  ${new Intl.NumberFormat(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      ).format(remainingBalance)}`}
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
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(currentPage - 1)}
                        disabled={currentPage === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-2 px-2">
                        <span className="text-sm text-muted-foreground">
                          {currentPage + 1} de {totalPages}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <DailyBalanceColumns
                  days={displayedDays}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  onDeleteExpense={deleteExpense}
                  onDeleteIncome={deleteIncome}
                />
              </div>

              {/* <FutureProjections
                  projections={futureProjections}
                  currentPage={currentProjectionPage}
                  totalPages={totalProjectionPages}
                  onPageChange={setProjectionPage}
                /> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
