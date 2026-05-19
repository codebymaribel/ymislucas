import { Card, CardContent } from "@/src/components/ui/card";
import { Account } from "@/src/types/accounts";
import { TrendingUp } from "lucide-react";
import { memo } from "react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

interface BalanceProps extends Omit<
  Account,
  "id" | "bank" | "type" | "number" | "color" | "income" | "expenses"
> {
  isCrypto?: boolean;
}
const BalanceBase = ({
  name,
  currency_code,
  balance,
  color,
  isCrypto,
}: BalanceProps) => {
  return (
    <Card className="col-span-1 bg-card text-sidebar-foreground border-0 shadow-md h-40">
      <CardContent className="pt-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-sidebar-foreground/60 mb-1">{name}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold font-mono tracking-tight">
                {formatCurrency(balance)}
              </p>
              <p className="text-sm text-sidebar-foreground/60">
                {currency_code}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-primary font-medium">
                +3.57% que hace un mes
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const BalanceCard = memo(BalanceBase);
