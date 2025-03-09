import { timestamp, pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { users } from "./usersSchema";

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, {
      // cascade means that when the user was deleted, the token will be also deleted
      onDelete: "cascade",
    })
    .unique(),
  token: text("token"),
  tokenExpiry: timestamp("token_expiry"),
});
