"use server";

import * as z from "zod";
import { hash } from "bcryptjs";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";

export const registerUser = async ({
  email,
  password,
  passwordConfirm,
}: {
  email: string;
  password: string;
  passwordConfirm: string;
}) => {
  try {
    const newUserSchema = z
      .object({
        email: z.string().email(),
      })
      .and(passwordMatchSchema);

    const newUserValidation = newUserSchema.safeParse({
      email,
      password,
      passwordConfirm,
    });

    if (!newUserValidation.success) {
      return {
        error: true,
        message:
          newUserValidation.error.issues[0]?.message ?? "An error occured",
      };
    }

    // here we use a simple salt for simplicity
    const hashedPassword = await hash(password, 10);

    await db.insert(users).values({
      email,
      password: hashedPassword,
    });
  } catch (error) {
    // 创建类型守卫，用来避免TS的类型告警
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505" // 23505 is unique_violation error
    ) {
      return {
        error: true,
        message: "Duplicated email",
      };
    }
    return {
      error: true,
      message: "An error occurred",
    };
  }
};
