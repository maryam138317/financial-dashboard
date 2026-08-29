import { create } from "zustand";
import { Transaction } from "@/lib/types";
import { transactions as seedTransactions } from "@/lib/data";
import { useAuthStore } from "./useAuthStore";

interface TransactionStore {
  transactions: Transaction[];

  addTransaction: (
    transaction: Omit<Transaction, "id" | "user_id">
  ) => void;

  editTransaction: (
    id: string,
    updates: Partial<Omit<Transaction, "id" | "user_id">>
  ) => void;

  removeTransaction: (id: string) => void;
}

export const useTransactionStore =
  create<TransactionStore>((set) => ({
    transactions: seedTransactions,

    addTransaction: (transaction) => {
      const { currentUser } =
        useAuthStore.getState();

      if (!currentUser) return;

      const newTransaction: Transaction = {
        ...transaction,
        id: crypto.randomUUID(),
        user_id: currentUser.id,
      };

      set((state) => ({
        transactions: [
          ...state.transactions,
          newTransaction,
        ],
      }));
    },

    editTransaction: (id, updates) => {
      set((state) => ({
        transactions: state.transactions.map(
          (transaction) =>
            transaction.id === id
              ? {
                  ...transaction,
                  ...updates,
                }
              : transaction
        ),
      }));
    },

    removeTransaction: (id) => {
      set((state) => ({
        transactions: state.transactions.filter(
          (transaction) =>
            transaction.id !== id
        ),
      }));
    },
  }));
