import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBalanceStore } from "@/stores/balance";
import { FlagIcon } from "lucide-react";
import { useState } from "react";
import { ExpenseForm } from "./expense-form";
import { IncomeForm } from "./income-form";
import { PlusIcon } from "./ui/animated-icons/plus";

export function RegistryModal() {
  const [type, setType] = useState<"monthly" | "yearly">("yearly");
  const { addIncome, addExpense } = useBalanceStore();

  const handleIncomeSubmit = (data: {
    amount: number;
    description: string;
    date: Date;
  }) => {
    addIncome(data);
  };

  const handleExpenseSubmit = (data: {
    amount: number;
    description: string;
    date: Date;
  }) => {
    addExpense(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="z-50">
          <PlusIcon />
          Novo Registro
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="mb-2 flex flex-col gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <FlagIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-left">Adicionar Registro</DialogTitle>
            <DialogDescription className="text-left">
              Adicione um novo registro de despesa ou receita.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4">
          <RadioGroup
            className="grid-cols-2"
            defaultValue="yearly"
            value={type}
            onValueChange={(value) => setType(value as "monthly" | "yearly")}
          >
            {/* Monthly */}
            <label className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col gap-1 rounded-md border px-4 py-3 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
              <RadioGroupItem
                id="radio-monthly"
                value="monthly"
                className="sr-only after:absolute after:inset-0"
              />
              <p className="text-foreground text-sm font-medium">Receita</p>
              <p className="text-muted-foreground text-sm">
                Salário, PLR, etc.
              </p>
            </label>
            {/* Yearly */}
            <label className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col gap-1 rounded-md border px-4 py-3 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
              <RadioGroupItem
                id="radio-yearly"
                value="yearly"
                className="sr-only after:absolute after:inset-0"
              />
              <p className="text-foreground text-sm font-medium">Despesa</p>
              <p className="text-muted-foreground text-sm">Água, Luz, etc.</p>
            </label>
          </RadioGroup>
          {type === "monthly" ? (
            <IncomeForm onSubmit={handleIncomeSubmit} />
          ) : (
            <ExpenseForm onSubmit={handleExpenseSubmit} />
          )}
        </div>

        <p className="text-muted-foreground text-center text-xs">
          Esses registros podem ser excluídos a qualquer momento.
        </p>
      </DialogContent>
    </Dialog>
  );
}
