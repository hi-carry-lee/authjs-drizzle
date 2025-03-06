import "dotenv/config";
import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: ".env.local",
});

export default defineConfig({
  // where all the schemas are stored
  schema: "./db/schema.ts",
  // which DB is used
  dialect: "postgresql",
  // DB credentials
  dbCredentials: {
    url: process.env.NEON_DB_URL!,
  },
});
