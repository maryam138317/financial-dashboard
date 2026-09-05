"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Goal, Transaction } from "@/lib/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useGoalStore } from "@/store/useGoalStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import TransactionTable from "@/components/transactions/table";

export default function GoalTransactionView({ goalId }: { goalId: string }) {
  const router = useRouter();

  const { currentUser } = useAuthStore();
  const { transactions, addTransaction, removeTransaction } = useTransactionStore();
  const { goals, removeGoal } = useGoalStore();

  const [isBuying, setIsBuying] = useState(false);

  const currentGoal = goals.find((goal) => goal.id === goalId);

  if (!currentGoal) {
    if (isBuying) return null;

    return <div className="p-6 text-sm text-slate-500">Goal not found.</div>;
  }

  const goalTransactions = transactions.filter(
    (item): item is Extract<Transaction, { type: "Savings" }> =>
      item.type === "Savings" &&
      item.user_id === currentUser?.id &&
      item.goal_id === currentGoal.id
  );

  const saved = goalTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const reached = saved >= currentGoal.amount;

  function handleBuy() {
    setIsBuying(true);

    goalTransactions.forEach((t) => removeTransaction(t.id));

    addTransaction({
      amount: currentGoal!.amount,
      type: "Expose",
      category: "Others",
      date: new Date(),
    });

    removeGoal(currentGoal!.id);

    router.push("/goals");
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{currentGoal.title}&apos;s Transactions</h1>

        {reached ? (
          <button
            type="button"
            onClick={handleBuy}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Buy
          </button>
        ) : (
          <Badge>Saving</Badge>
        )}
      </div>

      <div className="mt-4">
        <TransactionTable transactions={goalTransactions}/>
      </div>
    </div>
  );
}