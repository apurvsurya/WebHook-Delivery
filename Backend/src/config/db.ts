import "dotenv/config";
import { env } from "node:process";
import { Pool } from "pg";

export const pool = new Pool({
    host:process.env.DB_HOST,
    port:Number(process.env.DB_PORT),
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    user:process.env.DB_USER
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});