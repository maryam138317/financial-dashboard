"use client";

import TransactionTable from "@/components/transactions/table";
import TotalCard from "@/components/transactions/total-card";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function TransactionPage() {
  const transactions = useTransactionStore(
    (state) => state.transactions
  );

  const currentUser = useAuthStore(
    (state) => state.currentUser
  );

  const userTransactions = currentUser
    ? transactions.filter(
        (transaction) =>
          transaction.user_id === currentUser.id
      )
    : [];

  const totalIncome = userTransactions
    .filter((transaction) => transaction.type === "Income")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  const totalExpose = userTransactions
    .filter((transaction) => transaction.type === "Expose")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  const totalSavings = userTransactions
    .filter((transaction) => transaction.type === "Savings")
    .reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

  const remainingAmount =
    totalIncome - totalExpose - totalSavings;

  return (
    <main className="p-6">
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Transactions
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View all of your income, expenses, and savings.
          </p>
        </div>

        <div className="flex gap-3">
          <TotalCard
            className="bg-green-100 text-green-600 border border-green-600"
            title="Remaining"
            amount={remainingAmount}
          />

          <TotalCard
            className=""
            title="Income"
            amount={totalIncome}
          />

          <TotalCard
            className=""
            title="Expense"
            amount={totalExpose}
          />

          <TotalCard
            className=""
            title="Savings"
            amount={totalSavings}
          />
        </div>
      </div>

      <TransactionTable />
    </main>
  );
}
