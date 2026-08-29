export type TransactionType =
  | "Income"
  | "Expose"
  | "Savings";

export const incomeCategories = [
  "Salary",
  "Bonus",
  "Petty Cash",
  "Others",
] as const;

export type IncomeCategory =
  (typeof incomeCategories)[number];

export const exposeCategories = [
  "Transport",
  "Food",
  "Beauty",
  "Social Life",
  "Education",
  "Health",
  "Gift",
  "Others",
] as const;

export type ExposeCategory =
  (typeof exposeCategories)[number];

export const savingCategories = [
  "Save for Future",
] as const;

export type SavingCategory =
  (typeof savingCategories)[number];

export type TransactionCategory =
  | IncomeCategory
  | ExposeCategory
  | SavingCategory;

export interface User {
  id: string;
  username: string;
  password: string;
  image?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: Date;
  goal_id?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  amount: number;
}
