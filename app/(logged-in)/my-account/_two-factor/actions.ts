"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";

export const get2faSecret = async () => {
  // check if the user is logged in
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }
  const userId = parseInt(session.user.id);

  const [user] = await db
    .select({
      twoFactorSecret: users.twoFactorSecret,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    return {
      error: true,
      message: "User not found!",
    };
  }

  const twoFactorSecret = user.twoFactorSecret;

  // if no value, then create one and save it into table;
  if (!twoFactorSecret) {
    const twoFactorSecret = authenticator.generateSecret();
    await db
      .update(users)
      .set({ twoFactorSecret: twoFactorSecret })
      .where(eq(users.id, userId));
  }

  return {
    twoFactorSecret: authenticator.keyuri(
      session.user.email ?? "",
      "auth_drizzle",
      twoFactorSecret ?? ""
    ),
  };
  // the keyuri function return a string, this string satify 'Key URI Format',
  // all the OTP application can use this string to generate a QRcode
};

export const activate2fa = async (token: string) => {
  // check if the user is logged in
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }
  const userId = parseInt(session.user.id);

  const [user] = await db
    .select({
      twoFactorSecret: users.twoFactorSecret,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    return {
      error: true,
      message: "User not found!",
    };
  }

  const twoFactorSecret = user.twoFactorSecret;
  if (twoFactorSecret) {
    const tokenValid = authenticator.check(token, twoFactorSecret);

    if (!tokenValid) {
      return {
        error: true,
        message: "Invalid OTP!",
      };
    }

    await db
      .update(users)
      .set({ twoFactorActivated: true })
      .where(eq(users.id, userId));
  }
};

export const deActivate2fa = async () => {
  // check if the user is logged in
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }
  const userId = parseInt(session.user.id);
  const [user] = await db
    .select({
      twoFactorActivated: users.twoFactorActivated,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!user.twoFactorActivated) {
    return;
  }
  await db
    .update(users)
    .set({ twoFactorActivated: false })
    .where(eq(users.id, userId));
};
