import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import CurrencyInputField from "react-currency-input-field";

export interface CurrencyInputProps {
  id?: string;
  placeholder?: string;
  value?: number;
  onChange?: (value: number) => void;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, onChange, value, ...props }, ref) => {
    const handleValueChange = (value: string | undefined) => {
      // Converte string para number, ou 0 se undefined/empty
      const numericValue = value ? parseFloat(value) : 0;
      onChange?.(numericValue);
    };

    return (
      <CurrencyInputField
        ref={ref}
        value={value}
        onValueChange={handleValueChange}
        prefix="R$ "
        decimalSeparator=","
        groupSeparator="."
        decimalsLimit={2}
        allowDecimals={true}
        allowNegativeValue={false}
        disableGroupSeparators={false}
        disableAbbreviations={false}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
