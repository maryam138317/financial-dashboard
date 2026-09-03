"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pencil,
  PiggyBank,
  Trash2,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useTransactionStore } from "@/store/useTransactionStore";
import { useAuthStore } from "@/store/useAuthStore";

import { Transaction } from "@/lib/types";
import TransactionForm from "./transaction-form";

const ROWS_PER_PAGE = 9;

export default function TransactionTable({transactions}: {transactions: Transaction[]}) {


  const currentUser = useAuthStore(
    (state) => state.currentUser
  );

  const [currentPage, setCurrentPage] = useState(1);

  const userTransactions = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return transactions
      .filter(
        (transaction) =>
          transaction.user_id === currentUser.id
      )
      .reverse();
  }, [transactions, currentUser]);


  const totalPages = Math.max(
    1,
    Math.ceil(
      userTransactions.length / ROWS_PER_PAGE
    )
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex =
    (currentPage - 1) * ROWS_PER_PAGE;

  const currentTransactions =
    userTransactions.slice(
      startIndex,
      startIndex + ROWS_PER_PAGE
    );

  const firstItem =
    userTransactions.length === 0
      ? 0
      : startIndex + 1;

  const lastItem = Math.min(
    startIndex + ROWS_PER_PAGE,
    userTransactions.length
  );

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="h-12 pl-6">
                Date
              </TableHead>

              <TableHead className="h-12">
                Type
              </TableHead>

              <TableHead className="h-12">
                Category
              </TableHead>

              <TableHead className="h-12 text-right">
                Amount
              </TableHead>

              <TableHead className="h-12 w-27 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentTransactions.length === 0 ? (
              <EmptyState />
            ) : (
              currentTransactions.map(
                (transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                  />
                )
              )
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {userTransactions.length > 0 && (
        <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {firstItem}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {lastItem}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {userTransactions.length}
            </span>{" "}
            transactions
          </p>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}


function TransactionRow({
  transaction,
}: {
  transaction: Transaction;
}) {
  const [isOpen, setOpen] = useState(false);

  const removeTransaction = useTransactionStore(
    (state) => state.removeTransaction
  );

  function handleDelete() {
    removeTransaction(transaction.id);
  }

  return (
    <TableRow className="group transition-colors hover:bg-muted/30">
      {/* Date */}
      <TableCell className="pl-6">
        <span className="font-medium text-foreground">
          {formatDate(transaction.date)}
        </span>
      </TableCell>

      {/* Type */}
      <TableCell>
        <TransactionType
          type={transaction.type}
        />
      </TableCell>

      {/* Category */}
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {transaction.category}
        </span>
      </TableCell>

      {/* Amount */}
      <TableCell className="text-right">
        <TransactionAmount
          amount={transaction.amount}
          type={transaction.type}
        />
      </TableCell>

      {/* Actions */}
      <TableCell className="pr-6">
        <div className="flex items-center justify-end gap-1">
          {/* Edit */}
          <Dialog
            open={isOpen}
            onOpenChange={setOpen}
          >
            <DialogTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                  aria-label="Edit transaction"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              }
            />

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  Edit Transaction
                </DialogTitle>
              </DialogHeader>

              <TransactionForm
                transaction={transaction}
                onSuccess={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Delete */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
            aria-label="Delete transaction"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function TransactionType({
  type,
}: {
  type: Transaction["type"];
}) {
  const config: Record<
    Transaction["type"],
    {
      label: string;
      icon: typeof ArrowDownLeft;
      className: string;
    }
  > = {
    Income: {
      label: "Income",
      icon: ArrowDownLeft,
      className:
        "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400",
    },

    Expose: {
      label: "Expense",
      icon: ArrowUpRight,
      className:
        "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400",
    },

    Savings: {
      label: "Savings",
      icon: PiggyBank,
      className:
        "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400",
    },
  };

  const item = config[type];
  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${item.className}`}
    >
      <Icon className="h-3.5 w-3.5" />

      {item.label}
    </span>
  );
}


function TransactionAmount({
  amount,
  type,
}: {
  amount: number;
  type: Transaction["type"];
}) {
  const config: Record<
    Transaction["type"],
    {
      prefix: string;
      className: string;
    }
  > = {
    Income: {
      prefix: "+",
      className:
        "text-emerald-600 dark:text-emerald-400",
    },

    Expose: {
      prefix: "-",
      className:
        "text-red-600 dark:text-red-400",
    },

    Savings: {
      prefix: "-",
      className:
        "text-blue-600 dark:text-blue-400",
    },
  };

  const item = config[type];

  return (
    <span
      className={`font-semibold tabular-nums ${item.className}`}
    >
      {item.prefix}$
      {amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell
        colSpan={5}
        className="h-40 text-center"
      >
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="font-medium">
            No transactions yet
          </p>

          <p className="text-sm text-muted-foreground">
            Your transactions will appear here.
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = getPageNumbers(
    currentPage,
    totalPages
  );

  return (
    <div className="flex items-center gap-1">
      {/* Previous */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
      >
        <ChevronLeft className="h-4 w-4" />

        <span className="sr-only">
          Previous page
        </span>
      </Button>

      {/* Page numbers */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
            >
              ...
            </span>
          );
        }

        return (
          <Button
            key={page}
            type="button"
            variant={
              currentPage === page
                ? "default"
                : "outline"
            }
            size="icon"
            className="h-8 w-8 text-sm"
            onClick={() =>
              onPageChange(page)
            }
          >
            {page}
          </Button>
        );
      })}

      {/* Next */}
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        disabled={currentPage === totalPages}
        onClick={() =>
          onPageChange(currentPage + 1)
        }
      >
        <ChevronRight className="h-4 w-4" />

        <span className="sr-only">
          Next page
        </span>
      </Button>
    </div>
  );
}


function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  if (currentPage <= 3) {
    return [
      1,
      2,
      3,
      4,
      "...",
      totalPages,
    ];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

function formatDate(date: Date | string) {
  const parsedDate =
    date instanceof Date
      ? date
      : new Date(date);

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
