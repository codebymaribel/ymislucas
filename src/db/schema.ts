import {
  AnyPgColumn,
  boolean,
  decimal,
  index,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// --- ENUMS ---

export const accountTypeEnum = pgEnum("account_type", [
  "BANK",
  "CASH",
  "CRYPTO_WALLET",
  "FIAT_WALLET",
]);

export const currencyTypeEnum = pgEnum("currency_type", ["FIAT", "CRYPTO"]);

export const accountStatusEnum = pgEnum("account_status", [
  "ACTIVE",
  "INACTIVE",
]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  "INCOME",
  "EXPENSE",
  "TRANSFER",
]);

// --- TABLES ---

export const waitlist = pgTable("waitlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  deleted_at: timestamp("deleted_at"),
});

// Hybrid categories: user_id = null means system/global, user_id = uuid means user-created.
// is_system prevents users from editing or deleting global categories.
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }), // null = global
  name: varchar("name", { length: 100 }).notNull(),
  parent_id: uuid("parent_id").references((): AnyPgColumn => categories.id),
  is_system: boolean("is_system").notNull().default(false),
  color: varchar("color", { length: 7 }).default("#000000"),
  icon: varchar("icon", { length: 50 }).default(""),
});

export const currencies = pgTable("currencies", {
  code: varchar("code", { length: 10 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  symbol: varchar("symbol", { length: 10 }).notNull(),
  decimals: smallint("decimals").notNull().default(2),
  type: currencyTypeEnum("type").notNull().default("FIAT"),
});

// Index allows fast lookup of the latest rate for a given pair,
// which is the most frequent query pattern in the dashboard.
export const exchange_rates = pgTable(
  "exchange_rates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    base_currency_code: varchar("base_currency_code", { length: 10 })
      .references(() => currencies.code)
      .notNull(),
    target_currency_code: varchar("target_currency_code", { length: 10 })
      .references(() => currencies.code)
      .notNull(),
    rate: decimal("rate", { precision: 20, scale: 8 }).notNull(),
    source: varchar("source", { length: 50 }).notNull(), // e.g. "BCV", "paralelo", "BCRA", "blue", "coingecko"
    timestamp: timestamp("timestamp").notNull().defaultNow(),
  },
  (table) => [
    index("idx_exchange_rates_lookup").on(
      table.base_currency_code,
      table.target_currency_code,
      table.timestamp,
    ),
  ],
);

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  type: accountTypeEnum("type").notNull().default("CASH"),
  currency_code: varchar("currency_code", { length: 10 })
    .references(() => currencies.code)
    .notNull(),
  balance: decimal("balance", { precision: 20, scale: 8 })
    .notNull()
    .default("0"),
  status: accountStatusEnum("status").notNull().default("ACTIVE"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  deleted_at: timestamp("deleted_at"),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  account_id: uuid("account_id")
    .references(() => accounts.id, { onDelete: "cascade" })
    .notNull(),
  type: transactionTypeEnum("type").notNull(),
  currency_code: varchar("currency_code", { length: 10 })
    .references(() => currencies.code)
    .notNull(),
  exchange_rate_id: uuid("exchange_rate_id").references(
    () => exchange_rates.id,
  ),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  computed_usd_value: decimal("computed_usd_value", {
    precision: 20,
    scale: 8,
  }),
  category_id: uuid("category_id")
    .references(() => categories.id)
    .notNull(),
  // date = when the transaction actually happened (user-provided).
  // created_at = when the record was inserted in the DB.
  // These intentionally differ when a user logs a past transaction.
  date: timestamp("date").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  notes: text("notes"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  deleted_at: timestamp("deleted_at"),
});

// Links two transactions that represent the two sides of a transfer between accounts.
// e.g. moving money from a VES bank account to a crypto wallet creates:
//   - one TRANSFER transaction on the source account (negative amount)
//   - one TRANSFER transaction on the destination account (positive amount)
// Both are linked here so the UI can display them as a single transfer event.
export const transfers = pgTable("transfers", {
  id: uuid("id").primaryKey().defaultRandom(),
  from_transaction_id: uuid("from_transaction_id")
    .references(() => transactions.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  to_transaction_id: uuid("to_transaction_id")
    .references(() => transactions.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const user_security = pgTable("user_security", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  two_factor_secret: text("two_factor_secret"),
  two_factor_enabled: boolean("two_factor_enabled").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const user_backup_codes = pgTable("user_backup_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  code_hash: varchar("code_hash", { length: 255 }).notNull(),
  used_at: timestamp("used_at"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
