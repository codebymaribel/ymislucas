import { cn } from "@/lib/utils";
import { JSX } from "react";

export type CardProps = {
  name: string;
  balance: string;
  usdBalance?: string;
  lastUpdated?: string;
  icon: JSX.Element;
  color?: string;
  transactions?: {
    id: number;
    name: string;
    type: "expense" | "income";
    icon: JSX.Element;
    amount: string;
    date: string;
  }[];
};

const Card = ({
  name = "Card",
  balance = "0",
  usdBalance,
  lastUpdated,
  icon,
  color,
  transactions = [],
}: CardProps) => {
  return (
    <div
      className={cn(
        "relative w-92 min-h-48 h-fit rounded-2xl p-6 flex flex-col justify-between shadow-xl",
        "transition-all duration-300",
        "bg-slate-950 border-slate-800 border-2",
      )}
    >
      {/* Card content */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <p className="text-sm text-white/80 font-medium tracking-wide">
            {name}
          </p>
          {lastUpdated && (
            <p className="text-[10px] text-white/40 font-mono">
              Updated: {lastUpdated}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("p-3 rounded-xl w-fit", color)}>{icon}</div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-white tracking-tight">
                {balance}
              </p>
              {usdBalance && (
                <span className="text-lg text-white/60 font-medium">
                  / {usdBalance}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Card transactions */}
      <div className="space-y-2 border-t border-slate-700 rounded mt-2">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className={cn("p-3 text-white w-fit")}>
                {transaction.icon}
              </div>
              <p className="text-sm text-white/80 font-medium tracking-wide">
                {transaction.name}
              </p>
            </div>
            <p className="text-sm text-white/80 font-medium tracking-wide">
              {transaction.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
