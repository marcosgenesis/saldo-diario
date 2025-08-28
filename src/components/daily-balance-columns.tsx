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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowBigDownIcon, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
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
  onDeleteIncome,
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
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">
                {format(day.date, "EEEE", { locale: ptBR })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {format(day.date, "dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
            <Badge className="items-baseline gap-1.5">
              {formatCurrency(day.totalAvailable)}
              <span className="text-primary-foreground/60 text-[0.625rem] font-medium">
                Total Disponível
              </span>
            </Badge>
          </div>
          <div className="flex gap-2 items-center">
            <Badge className="items-baseline bg-gray-50 border border-gray-100 gap-1.5 text-gray-900">
              {formatCurrency(day.baseBalance)}
              <span className="text-gray-600 text-[0.625rem] font-medium">
                Saldo Base
              </span>
            </Badge>
            <Badge
              className={cn(
                "items-baseline gap-1.5",
                day.previousDayLeftover >= 0
                  ? "bg-green-50 border border-green-100 text-green-900"
                  : "bg-red-50 border border-red-100 text-red-900"
              )}
            >
              {formatCurrency(day.previousDayLeftover)}
              <span className="text-gray-600 text-[0.625rem] font-medium">
                Sobra Anterior
              </span>
            </Badge>
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
                              Tem certeza que deseja excluir este ganho? Esta
                              ação não pode ser desfeita.
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
                    className="flex justify-between items-center text-sm bg-red-50 p-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowBigDownIcon size={16} className="text-red-600" />
                      <span className="truncate text-red-600">
                        {expense.description}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-destructive tabular-nums">
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
                              Tem certeza que deseja excluir esta despesa? Esta
                              ação não pode ser desfeita.
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
            <div className="flex justify-between items-center font-semibold">
              <span>Saldo restante:</span>
              <span
                className={
                  day.remainingBalance >= 0
                    ? "text-green-600 tabular-nums"
                    : "text-destructive tabular-nums"
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
