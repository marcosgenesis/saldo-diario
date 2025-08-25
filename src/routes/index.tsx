import { DailyBalanceColumns } from '@/components/DailyBalanceColumns'
import { ExpenseForm } from '@/components/ExpenseForm'
import { FutureProjections } from '@/components/FutureProjections'
import { IncomeForm } from '@/components/IncomeForm'
import { InitialForm } from '@/components/InitialForm'
import { Button } from '@/components/ui/button'
import { useBalanceStore } from '@/stores/balance'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
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
    reset
  } = useBalanceStore()

  const handleInitialFormSubmit = (data: { balance: number; paymentDate: Date }) => {
    setInitialData(data)
  };

  const handleExpenseSubmit = (data: { amount: number; description: string; date: Date }) => {
    addExpense(data)
  };

  const handleIncomeSubmit = (data: { amount: number; description: string; date: Date }) => {
    addIncome(data)
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados? Essa ação não pode ser desfeita.')) {
      reset()
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8">
      <div className="max-w-7xl w-full px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Saldo Diário</h1>
          {paymentDate && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReset}
            >
              Resetar dados
            </Button>
          )}
        </div>
        {!paymentDate ? (
          <div className="max-w-md mx-auto">
            <InitialForm onSubmit={handleInitialFormSubmit} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="p-4 bg-card rounded-lg border">
                <div className="text-center">
                  <p className="text-lg font-medium">Seu saldo diário base é:</p>
                  <p className="text-3xl font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(dailyBalance)}
                  </p>
                </div>
                <div className="text-center mt-4">
                  <p className="text-lg font-medium">Saldo total restante:</p>
                  <p className="text-2xl font-bold text-secondary">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(remainingBalance)}
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-card rounded-lg border">
                <h2 className="text-xl font-bold mb-4">Registrar Despesa</h2>
                <ExpenseForm onSubmit={handleExpenseSubmit} />
              </div>

              <div className="p-4 bg-card rounded-lg border">
                <h2 className="text-xl font-bold mb-4">Registrar Ganho</h2>
                <IncomeForm onSubmit={handleIncomeSubmit} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

              <FutureProjections 
                projections={futureProjections}
                currentPage={currentProjectionPage}
                totalPages={totalProjectionPages}
                onPageChange={setProjectionPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
