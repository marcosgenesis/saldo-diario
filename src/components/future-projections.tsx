import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface FutureProjection {
  date: Date;
  baseBalance: number;
  previousDayLeftover: number;
  projectedExpenses: number;
  projectedIncomes: number;
  totalAvailable: number;
  projectedBalance: number;
}

interface FutureProjectionsProps {
  projections: FutureProjection[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function FutureProjections({ 
  projections, 
  currentPage, 
  totalPages, 
  onPageChange 
}: FutureProjectionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (projections.length === 0) {
    return (
      <div className="p-4 bg-card rounded-lg border">
        <h3 className="text-lg font-bold mb-4">Projeções Futuras</h3>
        <p className="text-center text-muted-foreground">
          Nenhuma projeção disponível
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-card rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Projeções Futuras</h3>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2 px-2">
              <span className="text-sm text-muted-foreground">
                {currentPage + 1} de {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-3">
        {projections.slice(currentPage * 7, (currentPage + 1) * 7).map((projection) => (
          <div
            key={projection.date.toISOString()}
            className="p-3 bg-muted rounded-lg space-y-2"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {format(projection.date, "EEEE", { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(projection.date, "dd 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(projection.totalAvailable)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Disponível
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Saldo base:</p>
                <p className="font-medium">{formatCurrency(projection.baseBalance)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sobra anterior:</p>
                <p className="font-medium text-green-600">
                  {formatCurrency(projection.previousDayLeftover)}
                </p>
              </div>
            </div>

            {(projection.projectedExpenses > 0 || projection.projectedIncomes > 0) && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                {projection.projectedExpenses > 0 && (
                  <div>
                    <p className="text-muted-foreground">Despesas previstas:</p>
                    <p className="font-medium text-destructive">
                      -{formatCurrency(projection.projectedExpenses)}
                    </p>
                  </div>
                )}
                {projection.projectedIncomes > 0 && (
                  <div>
                    <p className="text-muted-foreground">Ganhos previstos:</p>
                    <p className="font-medium text-green-600">
                      +{formatCurrency(projection.projectedIncomes)}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center font-bold">
                <span>Saldo projetado:</span>
                <span
                  className={
                    projection.projectedBalance >= 0
                      ? "text-green-600"
                      : "text-destructive"
                  }
                >
                  {formatCurrency(projection.projectedBalance)}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {projections.length > 7 && (
          <p className="text-center text-sm text-muted-foreground">
            Mostrando {currentPage * 7 + 1}-{Math.min((currentPage + 1) * 7, projections.length)} de {projections.length} dias projetados
          </p>
        )}
      </div>
    </div>
  );
}
