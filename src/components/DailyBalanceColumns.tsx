import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface DailyBalance {
  date: Date;
  baseBalance: number;
  previousDayLeftover: number;
  expenses: {
    id: string;
    amount: number;
    description: string;
    date: Date;
  }[];
  incomes: {
    id: string;
    amount: number;
    description: string;
    date: Date;
  }[];
  totalAvailable: number;
  remainingBalance: number;
}

interface DailyBalanceColumnsProps {
  days: DailyBalance[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDeleteExpense: (id: string) => void;
  onDeleteIncome: (id: string) => void;
}

export function DailyBalanceColumns({ 
  days, 
  // currentPage, 
  // totalPages,
  // onPageChange,
  onDeleteExpense,
  onDeleteIncome
}: DailyBalanceColumnsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {days.map((day) => (
          <div
            key={day.date.toISOString()}
            className="p-4 bg-card rounded-lg border space-y-4"
          >
            <div className="text-center">
              <h3 className="text-lg font-bold">
                {format(day.date, "EEEE", { locale: ptBR })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {format(day.date, "dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Saldo base:</span>
                <span className="font-medium">{formatCurrency(day.baseBalance)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Sobra anterior:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(day.previousDayLeftover)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span>Total disponível:</span>
                <span className="text-primary">
                  {formatCurrency(day.totalAvailable)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Ganhos do dia:</p>
              {day.incomes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Nenhum ganho
                </p>
              ) : (
                <div className="space-y-2">
                  {day.incomes.map((income) => (
                    <div
                      key={income.id}
                      className="flex justify-between items-center text-sm bg-green-50 p-2 rounded"
                    >
                      <span className="truncate">{income.description}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-green-600">
                          +{formatCurrency(income.amount)}
                        </span>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir ganho</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este ganho? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDeleteIncome(income.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Despesas do dia:</p>
              {day.expenses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Nenhuma despesa
                </p>
              ) : (
                <div className="space-y-2">
                  {day.expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex justify-between items-center text-sm bg-muted p-2 rounded"
                    >
                      <span className="truncate">{expense.description}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-destructive">
                          -{formatCurrency(expense.amount)}
                        </span>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir despesa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDeleteExpense(expense.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center font-bold">
                <span>Saldo restante:</span>
                <span
                  className={
                    day.remainingBalance >= 0
                      ? "text-green-600"
                      : "text-destructive"
                  }
                >
                  {formatCurrency(day.remainingBalance)}
                </span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}