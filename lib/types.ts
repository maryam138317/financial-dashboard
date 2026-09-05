export type IncomeCategory = "Salary" | "Bonus" | "Petty Cash" | "Others";
export type ExposeCategory =
  | "Transport"
  | "Beauty"
  | "Social Life"
  | "Education"
  | "Food"
  | "Health"
  | "Gift"
  | "Others";
export type SavingCategory = "Save for Future";

export const incomeCategories: IncomeCategory[] = ["Salary", "Bonus", "Petty Cash", "Others"];
export const exposeCategories: ExposeCategory[] = [
  "Transport", "Beauty", "Social Life", "Education", "Food", "Health", "Gift", "Others",
];
export const savingCategories: SavingCategory[] = ["Save for Future"];

export type TransactionCategory = IncomeCategory | ExposeCategory | SavingCategory;

interface BaseTransaction {
  id: string;
  user_id: string;
  amount: number;
  date: Date;
  note?: string;
}

export type Transaction =
  | (BaseTransaction & { type: "Income"; category: IncomeCategory })
  | (BaseTransaction & { type: "Expose"; category: ExposeCategory })
  | (BaseTransaction & { type: "Savings"; category: SavingCategory; goal_id: string });

export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export interface User {
  id: string;
  username: string;
  password: string;
  image?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  amount: number;
}