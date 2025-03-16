import { timestamp, pgTable, serial, text, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  password: text("password"),
  email: text("email").unique(),
  twoFactorActivated: boolean("2fa_activated").default(false),
  twoFactorSecret: text("2fa_secret"),
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").defaultNow(),
  passwordResetToken: text("password_reset_token"),
});
