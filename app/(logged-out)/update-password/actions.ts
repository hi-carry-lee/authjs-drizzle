"use server";

import db from "@/db/drizzle";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { eq } from "drizzle-orm";
import { passwordResetTokens } from "@/db/passwordResetTokens";
import { users } from "@/db/usersSchema";
import { auth } from "@/auth";
import { hash } from "bcryptjs";

export const updatePassword = async ({
  token,
  password,
  passwordConfirm,
}: {
  token: string;
  password: string;
  passwordConfirm: string;
}) => {
  const passwordValidation = passwordMatchSchema.safeParse({
    password,
    passwordConfirm,
  });

  if (!passwordValidation.success) {
    return {
      error: true,
      message:
        passwordValidation.error.issues[0]?.message ?? "An error occured",
    };
  }

  const session = await auth();
  if (session?.user?.id) {
    return {
      error: true,
      message: "Already logged in. Please log out to reset your password!",
    };
  }

  let tokenIsValid = false;
  if (token) {
    const [passworkResetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));
    if (
      !!passworkResetToken.tokenExpiry &&
      passworkResetToken.tokenExpiry.getTime() > Date.now()
    ) {
      tokenIsValid = true;
    }

    if (!tokenIsValid) {
      return {
        error: true,
        tokenIsValid: true,
        message: "Your token is invalid or has expired!",
      };
    }

    const hashedPassword = await hash(password, 10);

    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, passworkResetToken.userId!));

    // don't want the token to be used again when update password
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, passworkResetToken.id));
  }
};
