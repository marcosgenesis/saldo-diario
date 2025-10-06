import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { getBalances } from "@/queries/get-balances";
import type { Balance } from "@/stores/balance-store";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import type { Row } from "@tanstack/react-table";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
  loader: async () => {
    const response = await getBalances();
    return response;
  },
});

const columns = [
  {
    header: "Período",
    accessorKey: "startDate",
    cell: ({ row }: { row: Row<Balance> }) => {
      return (
        <div>
          {format(row.original.startDate, "dd/MM/yyyy")} -{" "}
          {format(row.original.endDate, "dd/MM/yyyy")}
        </div>
      );
    },
  },
  {
    header: "Saldo Inicial",
    accessorKey: "amount",
    cell: ({ row }: { row: Row<Balance> }) => {
      return (
        <Badge variant={"outline"}>
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(row.original.amount)}
        </Badge>
      );
    },
  },
  {
    header: "Total de Ingressos",
    accessorKey: "totalIncomes",
    cell: ({ row }: { row: Row<Balance> }) => {
      return (
        <div>
          <Badge>
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(row.original.totalIncomes)}
          </Badge>
        </div>
      );
    },
  },
  {
    header: "Total de Despesas",
    accessorKey: "totalExpenses",
    cell: ({ row }: { row: Row<Balance> }) => {
      return (
        <Badge variant={"destructive"}>
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(row.original.totalExpenses)}
        </Badge>
      );
    },
  },
  {
    header: "Saldo Final",
    accessorKey: "amount",
    cell: ({ row }: { row: Row<Balance> }) => {
      return (
        <Badge variant={"outline"}>
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(
            Number(row.original.amount) +
              row.original?.totalIncomes -
              row.original?.totalExpenses
          )}
        </Badge>
      );
    },
  },
];
function RouteComponent() {
  const loaderData = useLoaderData({ from: "/_authenticated/dashboard" });
  console.log(loaderData);
  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8">
      <div className="max-w-7xl w-full px-4">
        <h1 className="text-2xl font-bold">Histórico completo</h1>
      </div>
      <div className="max-w-7xl w-full px-4">
        <DataTable columns={columns} data={loaderData.data} />
      </div>
    </div>
  );
}
