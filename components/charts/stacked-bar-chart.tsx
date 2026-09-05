'use client';

import { Transaction } from "@/lib/types";
import { useAuthStore } from "@/store/useAuthStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useMediaQuery } from "@/hooks/use-media-query";
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
  const isMobile = useMediaQuery("(max-width: 639px)");

  const userTransactions = useMemo(() => {
    return transactions.filter((transaction) => transaction.user_id === currentUser?.id);
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
    <div className="mt-6 w-full rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={isMobile ? 280 : 380}>
          <BarChart
            data={chartData}
            margin={
              isMobile
                ? { top: 10, right: 0, bottom: 0, left: 0 }
                : { top: 20, right: 20, bottom: 0, left: 0 }
            }
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: isMobile ? 10 : 12, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              interval={isMobile ? "preserveStartEnd" : 0}
              angle={isMobile ? -35 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 50 : 30}
            />
            <YAxis
              tick={{ fontSize: isMobile ? 10 : 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              width={isMobile ? 40 : 60}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value) => `$${Number((value ?? 0).toLocaleString())}`}
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
            />
            <Legend wrapperStyle={{ fontSize: isMobile ? 11 : 13, paddingTop: 12 }} iconType="circle" />
            <Bar dataKey="Income" stackId="a" fill={TYPE_COLORS.Income} />
            <Bar dataKey="Expose" stackId="a" fill={TYPE_COLORS.Expose} />
            <Bar dataKey="Savings" stackId="a" fill={TYPE_COLORS.Savings} radius={[4, 4, 0, 0]} />
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