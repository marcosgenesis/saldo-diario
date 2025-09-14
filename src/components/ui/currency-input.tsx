import { Input } from "./input";

export const CurrencyInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  // Função para formatar em BRL
  const formatBRL = (val) => {
    if (isNaN(val) || val === null) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  // Função para extrair número do input
  const parseNumber = (str) => {
    if (!str) return 0;
    return Number(str.replace(/\D/g, "")) / 100; // divide por 100 para ter casas decimais
  };

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const numericValue = parseNumber(rawValue);
    onChange(numericValue);
  };

  return <Input type="text" value={formatBRL(value)} onChange={handleChange} />;
};
