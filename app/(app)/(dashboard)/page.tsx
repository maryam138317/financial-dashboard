"use client";

import TransactionTable from "@/components/transactions/table";
import TotalCard from "@/components/transactions/total-card";
import { useTransactionStore } from "@/store/useTransactionStore";

export default function TransactionPage() {
  const { totalExpose, totalIncome, totalSavings, remainingAmount } = useTransactionStore();

  return (
    <main className="space-y-6 p-4 sm:p-6">
      {/* Header + Summary */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Transactions
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View all of your income, expenses, and savings.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 lg:w-auto">
          <TotalCard title="Remaining" amount={remainingAmount()} className="border-green-600 text-green-600 bg-green-50"/>
          <TotalCard title="Income" amount={totalIncome()} className=""/>
          <TotalCard title="Expenses" amount={totalExpose()} className=""/>
          <TotalCard title="Savings" amount={totalSavings()} className=""/>
        </div>
      </div>

      {/* Transactions */}
      <TransactionTable />
    </main>
  );
}
