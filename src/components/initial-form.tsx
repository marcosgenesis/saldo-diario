import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface InitialFormProps {
  onSubmit: (data: { balance: number; paymentDate: Date }) => void;
}

export function InitialForm({ onSubmit }: InitialFormProps) {
  const [date, setDate] = useState<Date>();
  const [balance, setBalance] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !balance) return;

    onSubmit({
      balance: Number(balance),
      paymentDate: date,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto p-4">
      <div className="space-y-2">
        <Label htmlFor="balance">Quanto sobrou do seu salário?</Label>
        <Input
          id="balance"
          type="number"
          placeholder="Digite o valor"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Que dia você recebeu?</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" className="w-full" disabled={!date || !balance}>
        Calcular saldo diário
      </Button>
    </form>
  );
}
