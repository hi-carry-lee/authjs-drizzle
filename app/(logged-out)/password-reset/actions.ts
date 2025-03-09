"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { passwordResetTokens } from "@/db/passwordResetTokens";

export const resetPassword = async (email: string) => {
  const session = await auth();
  if (!!session?.user?.id) {
    return {
      error: true,
      message: "You are already logged in!",
    };
  }

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));

  if (!user) {
    // we don't want display exact message for security reason, since someone could use the returned message to attempt too many times
    return;
  }

  // create reset token
  // randomBytes comes from crypto module of nodejs
  const passwordResetToken = randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  try {
    await db
      .insert(passwordResetTokens)
      .values({
        userId: user.id,
        token: passwordResetToken,
        tokenExpiry: tokenExpiry,
      })
      .onConflictDoUpdate({
        target: passwordResetTokens.userId,
        set: {
          token: passwordResetToken,
          tokenExpiry: tokenExpiry,
        },
      });
  } catch (error) {
    console.log(error);
  }
};
