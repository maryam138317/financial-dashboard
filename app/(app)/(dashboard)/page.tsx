"use client";

import TransactionTable from "@/components/transactions/table";
import Dashboard from "@/components/layout/dashboard";
import { useTransactionStore } from "@/store/useTransactionStore";

export default function TransactionPage() {

  const transactions = useTransactionStore(
   (state) => state.transactions
  );

  return (
    <main className="p-6">
      <Dashboard title="Transactions" description="View all of your income, expenses, and savings."/>
      <TransactionTable transactions={transactions}/>
    </main>
  );
}
