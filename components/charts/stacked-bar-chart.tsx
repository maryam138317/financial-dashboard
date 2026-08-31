'use client';

import { Transaction } from "@/lib/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TYPE_COLORS: Record<string, string> = {
  Income: "#0D9488",
  Expose: "#E11D48",
  Savings: "#4F46E5",
};

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type MonthlyBucket = {
  sortKey: string;
  label: string;
  Income: number;
  Expose: number;
  Savings: number;
};

type MonthlyBucketMap = Record<string, MonthlyBucket>;

export default function BarChartComponent() {
  const { transactions } = useTransactionStore();
  const { currentUser } = useAuthStore();

  const userTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) => transaction.user_id === currentUser?.id
    );
  }, [transactions, currentUser?.id]);

  const chartData = useMemo(() => {
    const grouped: MonthlyBucketMap = {};

    userTransactions.forEach((transaction: Transaction) => {
      const date = new Date(transaction.date);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      const key = `${year}-${String(monthIndex).padStart(2, "0")}`;
      const label = `${MONTH_LABELS[monthIndex]} ${year}`;

      if (!grouped[key]) {
        grouped[key] = { sortKey: key, label, Income: 0, Expose: 0, Savings: 0 };
      }

      const type = transaction.type as "Income" | "Expose" | "Savings";
      grouped[key][type] += Number(transaction.amount);
    });

    return Object.values(grouped).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [userTransactions]);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 mt-6">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
            <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} iconType="circle" />
            <Bar dataKey="Income" stackId="a" fill={TYPE_COLORS.Income} />
            <Bar dataKey="Expose" stackId="b" fill={TYPE_COLORS.Expose} />
            <Bar dataKey="Savings" stackId="c" fill={TYPE_COLORS.Savings} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-80 items-center justify-center">
          <p className="text-sm text-slate-400">No transactions yet</p>
        </div>
      )}
    </div>
  );
}