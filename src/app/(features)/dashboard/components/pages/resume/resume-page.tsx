"use client";

import {
  accounts,
  budgets,
  pendingPayments,
  recentTransactions,
} from "@/lib/data";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { CreditCard } from "lucide-react";
import { BalanceCard } from "./balance-card";
import { BudgetCard } from "./budget-card";

export function formatCurrency(value: number) {
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
    <div className="relative z-10 flex flex-col gap-6 p-6">
      {/* ── Main Grid  ── */}
      <div className="grid grid-cols-6 gap-2">
        {/* ── Main Left Side ── */}
        <div className="col-span-4">
          {/* ── Top stat cards ── */}
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-stretch">
            {/* ── Left side container ── */}
            <div className="col-span-2 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
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

              {/* ── Middle Row: Pending Payments ── */}
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
                <CardContent className="space-y-3 flex-1">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground">
                      Total Due
                    </span>
                    <span className="text-base font-bold font-mono">
                      {formatCurrency(totalPendingAmount)}
                    </span>
                  </div>
                  {pendingPayments.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between"
                    >
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
            </div>
            {/* Recent Transactions */}
            <Card className="border border-border shadow-sm flex-1 min-h-0">
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
                  <div
                    key={txn.id}
                    className="flex items-center justify-between"
                  >
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
            {/* Your Accounts */}
            <div className="col-span-3 gap-4">
              {/* ── Account Sub-Cards ── */}

              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Your Main Accounts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.map((account) => (
                  <Card
                    key={account.id}
                    className="relative overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="pt-2 pb-2">
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
                        <Badge
                          variant="secondary"
                          className="text-[10px] capitalize"
                        >
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
          </div>
        </div>

        {/* ── Main Right Side ── */}
        <BudgetCard />
      </div>
    </div>
  );
}
