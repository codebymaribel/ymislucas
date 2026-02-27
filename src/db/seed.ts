import bcrypt from "bcryptjs";
import { db } from "./index";
import {
  accounts,
  categories,
  currencies,
  transactions,
  users,
} from "./schema";

async function main() {
  console.log("🌱 Seeding started...");

  // Delete in reverse FK dependency order to avoid constraint violations.
  await db.delete(transactions);
  await db.delete(accounts);
  await db.delete(categories);
  await db.delete(currencies);
  await db.delete(users);

  // --- USER ---
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

  // --- CURRENCIES ---
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
        name: "Bolívar Venezolano",
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

  console.log("💵 Monedas creadas.");

  // --- CATEGORIES ---
  // is_system = true marks these as global/protected — users cannot edit or delete them.
  // user_id = null means they belong to no specific user (visible to all).
  const systemCategories = await db
    .insert(categories)
    .values([
      {
        name: "Comida",
        color: "#FF5733",
        icon: "utensils",
        is_system: true,
        user_id: null,
      },
      {
        name: "Servicios",
        color: "#3357FF",
        icon: "bolt",
        is_system: true,
        user_id: null,
      },
      {
        name: "Alquiler",
        color: "#33FF57",
        icon: "home",
        is_system: true,
        user_id: null,
      },
      {
        name: "Transporte",
        color: "#FF33FF",
        icon: "bus",
        is_system: true,
        user_id: null,
      },
      {
        name: "Streaming",
        color: "#FFFF33",
        icon: "video",
        is_system: true,
        user_id: null,
      },
      {
        name: "Entretenimiento",
        color: "#FF9933",
        icon: "gamepad",
        is_system: true,
        user_id: null,
      },
      {
        name: "Salud",
        color: "#FF3333",
        icon: "heart",
        is_system: true,
        user_id: null,
      },
      {
        name: "Educación",
        color: "#3333FF",
        icon: "graduation-cap",
        is_system: true,
        user_id: null,
      },
      {
        name: "Compras",
        color: "#FF9933",
        icon: "shopping-cart",
        is_system: true,
        user_id: null,
      },
      {
        name: "Ingresos",
        color: "#00CC66",
        icon: "trending-up",
        is_system: true,
        user_id: null,
      },
      {
        name: "Otros",
        color: "#999999",
        icon: "ellipsis-h",
        is_system: true,
        user_id: null,
      },
    ])
    .returning();

  // Example of a user-created custom category.
  const [customCategory] = await db
    .insert(categories)
    .values({
      name: "Freelance",
      color: "#00BFFF",
      icon: "briefcase",
      is_system: false,
      user_id: user.id,
    })
    .returning();

  const categoryByName = Object.fromEntries(
    systemCategories.map((c) => [c.name, c]),
  );

  console.log(`🗂️ ${systemCategories.length + 1} categorías creadas.`);

  // --- ACCOUNTS ---
  const [bancoveAccount, zinliAccount, galiciaAccount] = await db
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

  console.log("🏦 Cuentas creadas.");

  // --- TRANSACTIONS ---
  // 'date' = when the transaction actually occurred (user-reported).
  // 'type' = INCOME | EXPENSE | TRANSFER.
  await db.insert(transactions).values([
    {
      account_id: galiciaAccount.id,
      type: "EXPENSE",
      category_id: categoryByName["Comida"].id,
      currency_code: "ARS",
      amount: "-4500.00",
      date: new Date("2025-06-10"),
      description: "Cena en Palermo",
      notes: "Validación inicial de seeding",
    },
    {
      account_id: zinliAccount.id,
      type: "INCOME",
      category_id: customCategory.id,
      currency_code: "USD",
      amount: "150.00",
      date: new Date("2025-06-12"),
      description: "Pago freelance cliente",
      notes: "Primer pago del mes",
    },
    {
      account_id: bancoveAccount.id,
      type: "EXPENSE",
      category_id: categoryByName["Transporte"].id,
      currency_code: "VES",
      amount: "-800.00",
      date: new Date("2025-06-13"),
      description: "Metro + bus",
      notes: null,
    },
  ]);

  console.log("💸 Transacciones creadas.");
  console.log(
    "✅ Seeding completado: User, Currencies, Categories, Accounts y Transactions.",
  );
}

main().catch((err) => {
  console.error("❌ Seeding error:", err);
  process.exit(1);
});
