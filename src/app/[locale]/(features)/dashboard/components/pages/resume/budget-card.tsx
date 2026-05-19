import BudgetProgressBar from "@/src/components/shared/budget-progress-bar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { budgets } from "@/src/lib/data";
import { memo } from "react";
import { formatCurrency } from "./dashboard-home";

const BudgetResumeBase = () => {
  return (
    <Card className="col-span-2 bg-card text-sidebar-foreground border-0 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          Presupuesto Mensual
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <BudgetProgressBar size="md" className="self-center" />
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
  );
};

export const BudgetCard = memo(BudgetResumeBase);
