import { cn } from "@/lib/utils";
import {
  createTransaction,
  createTransactionSchema,
} from "@/mutations/create-transaction";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface ExpenseFormProps {
  type: "income" | "expense";
}
const formSchema = createTransactionSchema.omit({
  balanceId: true,
  type: true,
});
export function ExpenseForm({ type }: ExpenseFormProps) {
  const { mutate: createTransactionMutation } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast.success("Transação criada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar transação");
    },
  });

  const form = useForm({
    defaultValues: {
      amount: 0,
      description: "",
      date: new Date(),
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createTransactionMutation({
        ...value,
        type,
        balanceId: "mCgpUwD0zOdQWdxse645wM0ZY5YtGMDl",
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="space-y-4"
    >
      <form.Field
        name="amount"
        children={({ state, handleChange }) => (
          <div className="space-y-2">
            <Label htmlFor="amount">Valor da despesa</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Digite o valor"
              value={state.value}
              onChange={(e) => handleChange(Number(e.target.value))}
              required
            />
          </div>
        )}
      />

      <form.Field
        name="description"
        children={({ state, handleChange }) => (
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              type="text"
              placeholder="Digite a descrição da despesa"
              value={state.value}
              onChange={(e) => handleChange(e.target.value)}
              required
            />
          </div>
        )}
      />

      <form.Field
        name="date"
        children={({ state, handleChange }) => (
          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !state.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {state.value
                    ? format(state.value, "PPP", { locale: ptBR })
                    : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={state.value}
                  onSelect={(date) => date && handleChange(date)}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      />

      <Button
        type="submit"
        className="w-full"
        onClick={() => {
          console.log(form.state.errors);
          form.handleSubmit();
        }}
      >
        Registrar despesa
      </Button>
    </form>
  );
}
