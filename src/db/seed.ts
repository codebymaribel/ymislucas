import { db } from "@/src/db";
import {
  accounts,
  categories,
  currencies,
  transactions,
  users,
} from "@/src/db/schema";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding started...");

  await db.delete(users);

  await db.delete(currencies);
  await db.delete(categories);
  await db.delete(accounts);
  await db.delete(transactions);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("TuPasswordSegura123", salt);

  const [user] = await db
    .insert(users)
    .values({
      email: "admin@ymislucas.com",
      password_hash: hashedPassword,
    })
    .returning();

  console.log(`👤 Usuario creado con ID: ${user.id}`);

  await db
    .insert(currencies)
    .values([
      {
        code: "ARS",
        name: "Peso Argentino",
        symbol: "$",
        decimals: 2,
        type: "FIAT",
      },
      {
        code: "USD",
        name: "Dólar Estadounidense",
        symbol: "$",
        decimals: 2,
        type: "FIAT",
      },
      {
        code: "VES",
        name: "Bolivares",
        symbol: "Bs",
        decimals: 2,
        type: "FIAT",
      },
      {
        code: "USDT",
        name: "Tether",
        symbol: "₮",
        decimals: 8,
        type: "CRYPTO",
      },
      {
        code: "BTC",
        name: "Bitcoin",
        symbol: "₿",
        decimals: 8,
        type: "CRYPTO",
      },
    ])
    .onConflictDoNothing();

  const [categoriesT] = await db
    .insert(categories)
    .values([
      { name: "Comida", color: "#FF5733", icon: "utensils" },
      { name: "Servicios", color: "#3357FF", icon: "bolt" },
      { name: "Alquiler", color: "#33FF57", icon: "home" },
      { name: "Transporte", color: "#FF33FF", icon: "bus" },
      { name: "Streaming", color: "#FFFF33", icon: "video" },
      { name: "Entretenimiento", color: "#FFFF33", icon: "gamepad" },
      { name: "Salud", color: "#FF3333", icon: "heartbeat" },
      { name: "Educación", color: "#3333FF", icon: "graduation-cap" },
      { name: "Compras", color: "#FF9933", icon: "shopping-cart" },
      { name: "Otros", color: "#999999", icon: "ellipsis-h" },
    ])
    .returning();

  const [bankAccount] = await db
    .insert(accounts)
    .values([
      {
        user_id: user.id,
        name: "Banesco Ve",
        type: "BANK",
        currency_code: "VES",
        balance: "0",
        status: "ACTIVE",
      },
      {
        user_id: user.id,
        name: "Zinli",
        type: "FIAT_WALLET",
        currency_code: "USD",
        balance: "20.48",
        status: "ACTIVE",
      },
      {
        user_id: user.id,
        name: "Banco Galicia",
        type: "BANK",
        currency_code: "ARS",
        balance: "250000.00",
        status: "ACTIVE",
      },
    ])
    .returning();

  await db.insert(transactions).values({
    account_id: bankAccount.id,
    category_id: categoriesT.id,
    currency_code: "ARS",
    amount: "4500.00",
    description: "Cena en Palermo",
    notes: "Validación inicial de seeding",
  });

  console.log(
    "✅ Seeding success: User, Accounts, Transactions, Categories and Currencies created.",
  );
}

main().catch((err) => {
  console.error("❌ Seeding error:", err);
  process.exit(1);
});
