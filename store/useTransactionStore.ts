import { create } from "zustand";
import { Transaction } from "@/lib/types";
import { transactions as seedTransactions } from "@/lib/data";
import { useAuthStore } from "./useAuthStore";

interface TransactionStore {
  transactions: Transaction[];

  userTransactions: () => Transaction[];
  totalExpose: () => number;
  totalIncome: () => number;
  totalSavings: () => number;

  addTransaction: (
    transaction: Omit<Transaction, "id" | "user_id">
  ) => void;

  editTransaction: (
    id: string,
    updates: Partial<Omit<Transaction, "id" | "user_id">>
  ) => void;

  removeTransaction: (id: string) => void;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: seedTransactions,

  userTransactions: () => {
    const { currentUser } = useAuthStore.getState();

    if (!currentUser) {
      return [];
    }

    return get().transactions.filter(
      (transaction) => transaction.user_id === currentUser.id
    );
  },

  totalExpose: () => {
    const { currentUser } = useAuthStore.getState();

    if (!currentUser) {
      return 0;
    }

    const exposeItems = get().transactions.filter(
      (transaction) =>
        transaction.user_id === currentUser.id &&
        transaction.type === "Expose"
    );

    return exposeItems.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
  },
  totalIncome: () => {
    const { currentUser } = useAuthStore.getState();

    if (!currentUser) {
      return 0;
    }

    const exposeItems = get().transactions.filter(
      (transaction) =>
        transaction.user_id === currentUser.id &&
        transaction.type === "Income"
    );

    return exposeItems.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
  },
  totalSavings: () => {
    const { currentUser } = useAuthStore.getState();

    if (!currentUser) {
      return 0;
    }

    const exposeItems = get().transactions.filter(
      (transaction) =>
        transaction.user_id === currentUser.id &&
        transaction.type === "Savings"
    );

    return exposeItems.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
  },

  addTransaction: (transaction) => {
    const { currentUser } = useAuthStore.getState();

    if (!currentUser) {
      return;
    }

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
        (transaction) => transaction.id !== id
      ),
    }));
  },
}));
