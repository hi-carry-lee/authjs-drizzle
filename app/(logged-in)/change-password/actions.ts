"use server";

import * as z from "zod";
import { passwordSchema } from "@/validation/passwordSchema";
import { hash, compare } from "bcryptjs";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export const changePassword = async ({
  currentPassword,
  password,
  passwordConfirm,
}: {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}) => {
  console.log("start change pwd~~~");
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: true,
      message: "You must be logged in to change your password!",
    };
  }

  const changePasswordSchema = z
    .object({
      currentPassword: passwordSchema,
    })
    .and(passwordMatchSchema);

  const passwordValidation = changePasswordSchema.safeParse({
    currentPassword,
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

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));

  if (!user) {
    return {
      error: true,
      message: "User not found!",
    };
  }

  // since user.password could be null, so there is a TS error, but we know it's not null, so we add !
  const passwordMatch = await compare(currentPassword, user.password!);
  if (!passwordMatch) {
    return {
      error: true,
      message: "Current password is incorrect!",
    };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, parseInt(session.user.id)));
    console.log("111");
  } catch (error) {
    console.log("error: ", error);
    return {
      error: true,
      message: "Incorrect password!",
    };
  }
};
