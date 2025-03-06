import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// 🌻因为process.env.NEON_DB_URL可能不存在，所以TS会警告，使用!告诉TS它存在即可
const sql = neon(process.env.NEON_DB_URL!);
const db = drizzle(sql);

export default db;
