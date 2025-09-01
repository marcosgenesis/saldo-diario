import { cn } from "@/lib/utils";
import { createBalance } from "@/mutations/create-balance";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Fragment } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function InitialForm() {
  const queryClient = useQueryClient();
  const { mutate: createBalanceMutation } = useMutation({
    mutationFn: createBalance,
    onSuccess: () => {
      toast.success("Saldo criado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["last-balances"] });
    },
    onError: () => {
      toast.error("Erro ao criar saldo");
    },
  });

  const form = useForm({
    defaultValues: {
      amount: 0,
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
    },
    onSubmit: ({ value }) => {
      createBalanceMutation(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="space-y-4 w-full max-w-md mx-auto p-4"
    >
      <div className="space-y-2">
        <form.Field
          name="amount"
          children={({ state, handleChange }) => (
            <Fragment>
              <Label htmlFor="balance">Quanto sobrou do seu salário?</Label>
              <Input
                id="balance"
                type="number"
                placeholder="Digite o valor"
                value={state.value}
                onChange={(e) => handleChange(Number(e.target.value))}
                required
              />
            </Fragment>
          )}
        />
      </div>

      <div className="space-y-2">
        <form.Field
          name="startDate"
          children={({ state, handleChange }) => (
            <Fragment>
              <Label>Que dia você recebeu?</Label>
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
                    onSelect={handleChange}
                    locale={ptBR}
                    required
                  />
                </PopoverContent>
              </Popover>
            </Fragment>
          )}
        />
      </div>
      <div className="space-y-2">
        <form.Field
          name="endDate"
          children={({ state, handleChange }) => (
            <Fragment>
              <Label>Até que dia você quer calcular?</Label>
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
                    onSelect={handleChange}
                    locale={ptBR}
                    required
                  />
                </PopoverContent>
              </Popover>
            </Fragment>
          )}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        onClick={() => form.handleSubmit()}
      >
        Calcular saldo diário
      </Button>
    </form>
  );
}
