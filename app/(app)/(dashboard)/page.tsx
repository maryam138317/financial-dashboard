"use client";

import TransactionTable from "@/components/transactions/table";
import TotalCard from "@/components/transactions/total-card";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useAuthStore } from "@/store/useAuthStore";
import Dashboard from "@/components/layout/dashboard";

export default function TransactionPage() {
  

  

  return (
    <main className="p-6">
      <Dashboard title="Transactions" description="View all of your income, expenses, and savings."/>
      <TransactionTable />
    </main>
  );
}
