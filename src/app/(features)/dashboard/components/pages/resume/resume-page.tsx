"use client";

import {
  accounts,
  budgets,
  cashFlowData,
  expenseBreakdown,
  pendingPayments,
  recentTransactions,
} from "@/lib/data";
import BudgetProgressBar from "@/src/components/shared/budget-progress-bar";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { CreditCard } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BalanceCard } from "./balance-card";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map(
          (
            entry: { color: string; name: string; value: number },
            i: number,
          ) => (
            <p key={i} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ),
        )}
      </div>
    );
  }
  return null;
};

export function ResumePage() {
  const totalPendingAmount = pendingPayments.reduce((s, p) => s + p.amount, 0);
  const overdueCount = pendingPayments.filter(
    (p) => p.status === "overdue",
  ).length;

  const totalAllocated = budgets.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* ── Top stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        {accounts.map((account) => (
          <BalanceCard
            key={account.id}
            balance={account.balance}
            name={account.name}
            currency_code={account.currency_code}
          />
        ))}
      </div>
      <BudgetProgressBar size="md" />

      {/* ── Account Sub-Cards ── */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Your Accounts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <Card
              key={account.id}
              className="relative overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-tight">
                        {account.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {account.bank}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] capitalize">
                    {account.type}
                  </Badge>
                </div>
                <p className="text-xl font-bold font-mono text-foreground">
                  {formatCurrency(account.balance)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {account.number}
                </p>
                {account.income > 0 && (
                  <div className="flex gap-4 mt-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        Income
                      </p>
                      <p className="text-xs font-semibold text-primary">
                        {formatCurrency(account.income)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        Expenses
                      </p>
                      <p className="text-xs font-semibold text-destructive">
                        {formatCurrency(account.expenses)}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cash Flow Chart */}
        <Card className="lg:col-span-2 border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Cash Flow Analysis
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Income vs Expenses — last 6 months
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={cashFlowData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#incomeGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#expGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown Pie */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Expense Breakdown
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              By category this month
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), ""]}
                />
                <Legend
                  iconSize={8}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-[10px] text-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Bottom Row: Pending + Budget + Transactions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending Payments Summary */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Pending Payments
              </CardTitle>
              {overdueCount > 0 && (
                <Badge variant="destructive" className="text-[10px]">
                  {overdueCount} overdue
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-xs text-muted-foreground">Total Due</span>
              <span className="text-base font-bold font-mono">
                {formatCurrency(totalPendingAmount)}
              </span>
            </div>
            {pendingPayments.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      p.status === "overdue"
                        ? "bg-destructive"
                        : p.status === "upcoming"
                          ? "bg-warning"
                          : "bg-primary"
                    }`}
                  />
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {p.dueDate}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold font-mono text-foreground">
                  {formatCurrency(p.amount)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Budget Remaining */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Budget Remaining
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalAllocated - totalSpent)} left of{" "}
              {formatCurrency(totalAllocated)}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {budgets.slice(0, 5).map((b) => {
              const pct = Math.round((b.spent / b.allocated) * 100);
              const remaining = b.allocated - b.spent;
              return (
                <div key={b.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">
                      {b.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatCurrency(remaining)} left
                    </span>
                  </div>
                  <Progress
                    value={pct}
                    className="h-1.5"
                    style={{ ["--progress-color" as string]: b.color }}
                  />
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {pct}% used
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Recent Transactions
              </CardTitle>
              <button className="text-[11px] text-primary hover:underline">
                See all
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      txn.type === "income"
                        ? "bg-primary/10 text-primary"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {txn.counterparty.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {txn.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {txn.date}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold font-mono ${
                    txn.amount > 0 ? "text-primary" : "text-destructive"
                  }`}
                >
                  {txn.amount > 0 ? "+" : ""}
                  {formatCurrency(txn.amount)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
