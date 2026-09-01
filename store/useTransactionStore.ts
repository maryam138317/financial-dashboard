import { create } from "zustand";
import { Transaction, DistributiveOmit } from "@/lib/types";
import { transactions as seedTransactions } from "@/lib/data";
import { useAuthStore } from "./useAuthStore";

interface TransactionStore {
  transactions: Transaction[];

  addTransaction: (
    transaction: DistributiveOmit<Transaction, "id" | "user_id">
  ) => void;

  editTransaction: (
    id: string,
    updates: Partial<Transaction>
  ) => void;

  removeTransaction: (id: string) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: seedTransactions,

  addTransaction: (transaction) => {
    const { currentUser } = useAuthStore.getState();

    if (!currentUser) return;

    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      user_id: currentUser.id,
    };

    set((state) => ({
      transactions: [...state.transactions, newTransaction],
    }));
  },

  editTransaction: (id, updates) => {
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === id
          ? ({ ...transaction, ...updates } as Transaction)
          : transaction
      ),
    }));
  },

  removeTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }));
  },
}));