'use client';

import { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useMemo, useState } from "react";
import {
  Pie,
  PieChart,
  Sector,
  PieSectorDataItem,
  Cell,
} from "recharts";

const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;

  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));

  const sx =
    (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;

  const sy =
    (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;

  const mx =
    (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;

  const my =
    (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;

  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;

  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      {/* Center label */}
      <text
        x={cx}
        y={cy}
        dy={-8}
        textAnchor="middle"
        fill="#0f172a"
        className="font-medium"
      >
        {payload?.name}
      </text>

      {/* Center amount */}
      <text
        x={cx}
        y={cy}
        dy={18}
        textAnchor="middle"
        fill="#0f172a"
        className="font-semibold"
      >
        ${Number(value).toLocaleString()}
      </text>

      {/* Main active slice */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      {/* Active slice highlight */}
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />

      {/* Connector */}
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />

      <circle
        cx={ex}
        cy={ey}
        r={2}
        fill={fill}
        stroke="none"
      />

      {/* Amount outside */}
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#334155"
        fontSize={13}
        fontWeight={500}
      >
        ${Number(value).toLocaleString()}
      </text>

      {/* Percentage */}
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#94a3b8"
        fontSize={11}
      >
        {`${((percent ?? 0) * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};

export default function PieChartComponent() {
  const { transactions } = useTransactionStore();
  const { currentUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState("Expose");

  const tabs = ["Expose", "Income", "Savings"];
  const colors = [
    "#4F46E5", // Indigo
    "#0D9488", // Teal
    "#F59E0B", // Amber
    "#E11D48", // Rose
    "#7C3AED", // Violet
    "#0284C7", // Sky
    "#65A30D", // Lime
    "#DB2777", // Pink
  ];

  const userTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) =>
        transaction.user_id === currentUser?.id
    );
  }, [transactions, currentUser?.id]);

  const activeTransactions = useMemo(() => {
    return userTransactions.filter(
      (transaction) =>
        transaction.type === activeTab
    );
  }, [userTransactions, activeTab]);

  const chartData = useMemo(() => {
    const grouped = activeTransactions.reduce(
      (
        acc: Record<string, number>,
        transaction: Transaction
      ) => {
        const category =
          transaction.category || "Other";

        acc[category] =
          (acc[category] || 0) +
          Number(transaction.amount);

        return acc;
      },
      {}
    );

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [activeTransactions]);

  return (
    <div className="w-full space-y-6">

      {/* Chart card */}
      <div className="flex w-full items-center gap-8 rounded-2xl border border-slate-200 bg-white pl-5">

        {/* Tabs */}
        <div className="flex w-32 shrink-0 flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "w-full rounded-xl px-4 py-3 text-left",
                "text-sm font-medium transition-all",
                "text-slate-600 hover:bg-slate-100",
                "hover:text-slate-900",
                activeTab === tab &&
                  "bg-slate-900 text-white shadow-sm",
                activeTab === tab &&
                  "hover:bg-slate-900 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-56 w-px bg-slate-200" />

        {/* Chart */}
        <div className="flex min-h-80 h-fit flex-1 items-center justify-center">
          {chartData.length > 0 ? (
            <PieChart
              style={{
                width: "100%",
                maxWidth: "500px",
                aspectRatio: 1,
              }}
              responsive
              margin={{
                top: 50,
                right: 100,
                bottom: 20,
                left: 100,
              }}
            >
              <Pie
                data={chartData}
                activeShape={renderActiveShape}
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="74%"
                dataKey="value"
                isAnimationActive
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>

              
            </PieChart>
          ) : (
            <div className="flex h-80 items-center justify-center">
              <p className="text-sm text-slate-400">
                No {activeTab.toLowerCase()} transactions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
