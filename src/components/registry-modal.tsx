import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { registryModalStore } from "@/hooks/use-registry-modal";
import { FlagIcon } from "lucide-react";
import { Drawer } from "vaul";
import { ExpenseForm } from "./expense-form";
import { IncomeForm } from "./income-form";
import { PlusIcon } from "./ui/animated-icons/plus";

export function RegistryModal() {
  const { type, setType, isOpen, setIsOpen } = registryModalStore();

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger asChild>
        <Button className="z-2 md:w-fit w-full">
          <PlusIcon />
          Novo Registro
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-background flex h-[95%] flex-col rounded-t-[10px] border-t fixed bottom-0 left-0 right-0">
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 flex flex-col gap-2">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <FlagIcon className="opacity-80" size={16} />
              </div>
              <div>
                <Drawer.Title className="text-left text-lg font-semibold">
                  Adicionar Registro
                </Drawer.Title>
                <Drawer.Description className="text-left text-sm text-muted-foreground">
                  Adicione um novo registro de despesa ou receita.
                </Drawer.Description>
              </div>
            </div>

            <div className="space-y-4">
              <RadioGroup
                className="grid-cols-2"
                defaultValue="yearly"
                value={type}
                onValueChange={(value) =>
                  setType(value as "income" | "expense")
                }
              >
                {/* Income */}
                <label className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col gap-1 rounded-md border px-4 py-3 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
                  <RadioGroupItem
                    id="radio-income"
                    value="income"
                    className="sr-only after:absolute after:inset-0"
                  />
                  <p className="text-foreground text-sm font-medium">Receita</p>
                  <p className="text-muted-foreground text-sm">
                    Salário, PLR, etc.
                  </p>
                </label>
                {/* Expense */}
                <label className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col gap-1 rounded-md border px-4 py-3 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-[3px]">
                  <RadioGroupItem
                    id="radio-expense"
                    value="expense"
                    className="sr-only after:absolute after:inset-0"
                  />
                  <p className="text-foreground text-sm font-medium">Despesa</p>
                  <p className="text-muted-foreground text-sm">
                    Água, Luz, etc.
                  </p>
                </label>
              </RadioGroup>

              {type === "income" ? (
                <IncomeForm type={type} />
              ) : (
                <ExpenseForm type={type} />
              )}
            </div>

            <p className="text-muted-foreground text-center text-xs mt-4">
              Esses registros podem ser excluídos a qualquer momento.
            </p>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
