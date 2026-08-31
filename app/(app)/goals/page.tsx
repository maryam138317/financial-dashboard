'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Goal } from "@/lib/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useGoalStore } from "@/store/useGoalStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { PlusIcon } from "lucide-react";

export default function GoalsPage() {
  const { goals, addGoal, removeGoal } = useGoalStore();
  const { currentUser } = useAuthStore();
  const { transactions, addTransaction } = useTransactionStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const UserGoals: Goal[] = goals.filter(
    (goal) => goal.user_id === currentUser?.id
  );

  const savedAmountFor = (goalId: string) =>
    transactions
      .filter((t) => t.user_id === currentUser?.id && t.goal_id === goalId)
      .reduce((sum, t) => sum + Number(t.amount), 0);

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

  const handleBuy = (goal: Goal) => {
    addTransaction({
      amount: goal.amount,
      type: "Expose",
      category: "Others",
      date: new Date(),
      goal_id: goal.id,
    });
    removeGoal(goal.id)
  };

  return (
    <>
      <div className="p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Goals
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Save Money to achieve Goals!
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Saved Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {UserGoals.map((goal) => {
              const saved = savedAmountFor(goal.id);
              const percentage = Math.min(
                Math.round((saved / goal.amount) * 100),
                100
              );
              const reached = percentage >= 100;

              return (
                <TableRow key={goal.id}>
                  <TableCell>{goal.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span>{`$${saved.toLocaleString()} of $${goal.amount.toLocaleString()}`}</span>
                      <Progress value={percentage} className="h-2 w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {saved === 0
                      ? "Not started"
                      : reached
                      ? "Goal Reached!"
                      : `Saving... ${percentage}%`}
                  </TableCell>
                  <TableCell>
                    {reached && (
                      <Button size="sm" onClick={() => handleBuy(goal)}>
                        Buy
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Add Goal Button + Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger
          render={
            <Button
              type="button"
              size="icon-lg"
              className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
            />
          }
        >
          <PlusIcon className="size-5" />
          <span className="sr-only">Add a Goal</span>
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
    </>
  );
}