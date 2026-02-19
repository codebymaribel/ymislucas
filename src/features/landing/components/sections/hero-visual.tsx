import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bitcoin,
  DollarSign,
  TrendingUpIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import Card, { CardProps } from "../ui/card";

type AccountType = CardProps & {
  id: number;
  currency: string;
  bg: string;
  usdValue: number;
};

const accounts: AccountType[] = [
  {
    id: 1,
    name: "Efectivo ARS",
    balance: "120.000",
    usdBalance: "u$s 100",
    usdValue: 100,
    lastUpdated: "Today 10:30 AM",
    currency: "ARS",
    icon: <DollarSign />,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    transactions: [
      {
        id: 1,
        name: "Supermercado",
        amount: "-250",
        date: "2025-12-18",
        type: "expense",
        icon: <ArrowDownLeft color="oklch(70.4% 0.191 22.216)" />,
      },
      {
        id: 2,
        name: "Pago de ana",
        amount: "+500",
        date: "2025-12-19",
        type: "income",
        icon: <ArrowUpRight color="oklch(76.5% 0.177 163.223)" />,
      },
    ],
  },
  {
    id: 2,
    name: "Cripto (BTC)",
    balance: "0.0030",
    usdBalance: "u$s 200",
    usdValue: 200,
    lastUpdated: "Just now",
    currency: "BTC",
    icon: <Bitcoin />,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    transactions: [
      {
        id: 1,
        name: "Supermercado",
        amount: "-250",
        date: "2025-12-18",
        type: "expense",
        icon: <ArrowDownLeft color="oklch(70.4% 0.191 22.216)" />,
      },
      {
        id: 2,
        name: "Pago de ana",
        amount: "+500",
        date: "2025-12-19",
        type: "income",
        icon: <ArrowUpRight color="oklch(76.5% 0.177 163.223)" />,
      },
    ],
  },
  {
    id: 3,
    name: "Banesco VE",
    balance: "2.400",
    usdBalance: "u$s 45",
    usdValue: 45,
    lastUpdated: "Yesterday",
    currency: "VES",
    icon: <p>Bs</p>,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    transactions: [
      {
        id: 1,
        name: "Supermercado",
        amount: "-250",
        date: "2025-12-18",
        type: "expense",
        icon: <ArrowDownLeft color="oklch(70.4% 0.191 22.216)" />,
      },
      {
        id: 2,
        name: "Pago de ana",
        amount: "+500",
        date: "2025-12-19",
        type: "income",
        icon: <ArrowUpRight color="oklch(76.5% 0.177 163.223)" />,
      },
    ],
  },
  {
    id: 4,
    name: "Cuenta tio Matty",
    balance: "$1.200",
    usdBalance: "u$s 1.200",
    usdValue: 1200,
    lastUpdated: "2 mins ago",
    currency: "USD",
    icon: <DollarSign />,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    transactions: [
      {
        id: 1,
        name: "Supermercado",
        amount: "-250",
        date: "2025-12-18",
        type: "expense",
        icon: <ArrowDownLeft color="oklch(70.4% 0.191 22.216)" />,
      },
      {
        id: 2,
        name: "Pago de ana",
        amount: "+500",
        date: "2025-12-19",
        type: "income",
        icon: <ArrowUpRight color="oklch(76.5% 0.177 163.223)" />,
      },
    ],
  },
];

import NumberTicker from "../ui/number-ticker";

export default function HeroVisual() {
  const [cards, setCards] = useState(accounts);
  const [transitioning, setTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // Initialize total balance with the sum of all accounts
  const [totalBalance, setTotalBalance] = useState(() => {
    return accounts.reduce((acc, curr) => acc + curr.usdValue, 0);
  });

  /* 
    State to control the sequence:
    1. Ticker Animates to current totalBalance
    2. Ticker finishes -> calls onAnimationComplete
    3. Wait small delay -> setTransitioning(true) (Slide starts)
    4. Slide finishes (setTimeout) -> setCards (Swap) & setTransitioning(false)
    5. Update totalBalance (add new card value) -> Ticker animates to new total -> Loop restarts
  */

  const handleTickerComplete = () => {
    setTimeout(() => {
      setTransitioning(true);

      setTimeout(() => {
        setCards((prev) => {
          const newCards = [...prev];
          const firstCard = newCards.shift();
          if (firstCard) {
            newCards.push(firstCard);

            setTotalBalance((current) => current + firstCard.usdValue);
          }
          return newCards;
        });
        setTransitioning(false);
      }, 1000); // Wait for slide to finish
    }, 1000); // Wait after ticker finishes before sliding
  };

  return (
    <div className="relative flex flex-col gap-6 w-full max-w-md mx-auto ">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative rounded-3xl shadow-2xl group overflow-hidden z-20"
      >
        <div className="absolute inset-[-200%] border-gradient-emerald opacity-0 group-hover:opacity-100 group-hover:animate-border-spin transition-opacity duration-1000" />

        <div className="relative bg-emerald-800 m-[1.5px] p-8 rounded-[calc(1.5rem-1.5px)] overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUpIcon size={250} />
          </div>

          <p className="text-slate-200 text-sm font-medium mb-1 text-balance">
            Balance Consolidado
          </p>
          <div className="flex items-baseline gap-1 text-4xl font-mono font-bold text-white tracking-tighter">
            ${" "}
            <NumberTicker
              value={totalBalance}
              decimalPlaces={2}
              onAnimationComplete={handleTickerComplete}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full font-bold border border-emerald-500/20">
              +2.4% este mes
            </span>
          </div>
        </div>
      </motion.div>

      {/*Accounts carousel */}
      <div
        ref={containerRef}
        className="relative h-[40vh] flex items-end justify-center"
        style={{
          clipPath: "inset(-200% -100% 0% -100%)",
        }}
      >
        {cards.map((card, index) => {
          const isLast = index === cards.length - 1;
          const isFirst = index === 0;
          const zIndex = index;
          const reverseIndex = cards.length - 1 - index;

          // Calculate position
          let bottomPosition = reverseIndex * 80;

          if (transitioning) {
            if (isFirst) {
              // Top card slides down
              bottomPosition = -280;
            } else {
              // All other cards move up by one position
              bottomPosition = (reverseIndex + 1) * 80;
            }
          }

          return (
            <div
              key={card.name}
              className="absolute transition-all duration-700 ease-in-out"
              style={{
                bottom: `${bottomPosition}px`,
                zIndex: transitioning && isFirst ? -1 : zIndex,
                opacity: transitioning && isFirst ? 0 : 1,
                transform: `scale(${1 - reverseIndex * 0.05})`,
                pointerEvents: isLast ? "auto" : "none",
              }}
            >
              <Card
                name={card.name}
                balance={card.balance}
                usdBalance={card.usdBalance}
                lastUpdated={card.lastUpdated}
                icon={card.icon}
                color={card.color}
                transactions={card.transactions}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
