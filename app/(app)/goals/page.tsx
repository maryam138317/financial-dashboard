'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Goal, Transaction } from "@/lib/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useGoalStore } from "@/store/useGoalStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { PlusIcon, PiggyBankIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function GoalRing({ percentage, reached }: { percentage: number; reached: boolean }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex size-20 shrink-0 items-center justify-center">
      <svg viewBox="0 0 80 80" className="size-20 -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={reached ? "#0D9488" : "#4F46E5"}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {reached ? (
          <CheckIcon className="size-5 text-teal-600" />
        ) : (
          <span className="text-sm font-semibold text-slate-900">{percentage}%</span>
        )}
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const { goals, addGoal, removeGoal } = useGoalStore();
  const { currentUser } = useAuthStore();
  const { transactions, addTransaction, removeTransaction } = useTransactionStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const UserGoals: Goal[] = goals.filter(
    (goal) => goal.user_id === currentUser?.id
  );


  const handleAddGoal = () => {
    if (!title.trim() || !amount) return;

    addGoal({
      title: title.trim(),
      amount: Number(amount),
    });

    setTitle("");
    setAmount("");
    setDialogOpen(false);
  };

  const savedAmountFor = (goalId: string) =>
  transactions
    .filter(
      (t): t is Extract<Transaction, { type: "Savings" }> => t.type === "Savings"
    )
    .filter((t) => t.user_id === currentUser?.id && t.goal_id === goalId)
    .reduce((sum, t) => sum + Number(t.amount), 0);

const handleBuy = (goal: Goal) => {
  const relatedSavingsIds = transactions
    .filter(
      (t): t is Extract<Transaction, { type: "Savings" }> => t.type === "Savings"
    )
    .filter((t) => t.goal_id === goal.id && t.user_id === currentUser?.id)
    .map((t) => t.id);

  relatedSavingsIds.forEach((id) => removeTransaction(id));

  addTransaction({
    amount: goal.amount,
    type: "Expose",
    category: "Others",
    date: new Date(),
  });

  removeGoal(goal.id);
};

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Goals
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Save money to reach the things you want.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            render={<Button type="button" className="gap-2" />}
          >
            <PlusIcon className="size-4" />
            New goal
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Goal</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="goal-title">Title</Label>
                <Input
                  id="goal-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. MacBook Pro"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="goal-amount">Target Amount</Label>
                <Input
                  id="goal-amount"
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleAddGoal}>Add Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {UserGoals.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-center">
          <PiggyBankIcon className="size-8 text-slate-300" />
          <div>
            <p className="font-medium text-slate-900">No goals yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Add a goal and start marking savings toward it.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {UserGoals.map((goal) => {
            const saved = savedAmountFor(goal.id);
            const percentage = Math.min(
              Math.round((saved / goal.amount) * 100),
              100
            );
            const reached = percentage >= 100;
            const remaining = Math.max(goal.amount - saved, 0);

            return (
              <div
                key={goal.id}
                className={cn(
                  "flex gap-4 rounded-2xl border border-slate-200 bg-white p-5",
                  "border-l-4",
                  reached ? "border-l-teal-600" : "border-l-indigo-500"
                )}
              >
                <GoalRing percentage={percentage} reached={reached} />

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{goal.title}</h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {`$${saved.toLocaleString()} of $${goal.amount.toLocaleString()} saved`}
                    </p>
                  </div>

                  <div className="mt-3">
                    {reached ? (
                      <Button size="sm" className="w-full" onClick={() => handleBuy(goal)}>
                        Buy {goal.title}
                      </Button>
                    ) : (
                      <p className="text-xs text-slate-400">
                        {`$${remaining.toLocaleString()} left to save`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}