import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";
import { Pool } from "pg";

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  console.log("🚀 Iniciando migración de base de datos...");

  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), "drizzle"),
  });

  console.log("✅ Migración completada con éxito.");

  await pool.end();
}

main().catch((err) => {
  console.error("❌ Error durante la migración:", err);
  process.exit(1);
});
