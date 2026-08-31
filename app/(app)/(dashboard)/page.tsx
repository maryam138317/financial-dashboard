"use client";

import TransactionTable from "@/components/transactions/table";
import Dashboard from "@/components/layout/dashboard";

export default function TransactionPage() {

  return (
    <main className="p-6">
      <Dashboard title="Transactions" description="View all of your income, expenses, and savings."/>
      <TransactionTable />
    </main>
  );
}
