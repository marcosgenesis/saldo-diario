import { registryModalStore } from "@/hooks/use-registry-modal";
import { cn } from "@/lib/utils";
import {
  createTransaction,
  createTransactionSchema,
} from "@/mutations/create-transaction";
import { useBalanceStore } from "@/stores/balance-store";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { CurrencyInput } from "./ui/currency-input";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface IncomeFormProps {
  type: "income" | "expense";
}
const formSchema = createTransactionSchema.omit({
  balanceId: true,
  type: true,
});

export function IncomeForm({ type }: IncomeFormProps) {
  const { setIsOpen } = registryModalStore();
  const queryClient = useQueryClient();
  const { balance } = useBalanceStore();
  const { mutate: createTransactionMutation } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast.success("Receita criada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["daily-balances"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      setIsOpen(false);
    },
    onError: (error) => {
      console.log({ error });
      toast.error("Erro ao criar receita", {
        description: error.message,
      });
      queryClient.invalidateQueries({ queryKey: ["daily-balances"] });
      setIsOpen(false);
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
        balanceId: balance?.id as string,
      });
    },
  });
  console.log(form.state.errors);
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
            <Label htmlFor="amount">Valor do ganho</Label>
            <CurrencyInput value={state.value} onChange={handleChange} />
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
              placeholder="Digite a descrição do ganho"
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
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {state.value
                    ? format(state.value, "PPP", { locale: ptBR })
                    : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
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
        variant="default"
        onClick={() => {
          form.handleSubmit();
        }}
      >
        Registrar ganho
      </Button>
    </form>
  );
}
