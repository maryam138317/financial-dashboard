export type TransactionType = "Income" | "Expose" | "Savings";

export type IncomeCategory =
  | "Salary"
  | "Bonus"
  | "Petty Cash"
  | "Others";

export type ExposeCategory =
  | "Transport"
  | "Food"
  | "Beauty"
  | "Social Life"
  | "Education"
  | "Health"
  | "Gift"
  | "Others";

export type SavingCategory = "Save for Future";

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
