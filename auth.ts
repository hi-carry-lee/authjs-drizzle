import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { users } from "./db/usersSchema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        if (!user) {
          throw new Error("Incorrect credentials!");
        } else {
          const passwordCorrect = await compare(
            credentials.password as string,
            user.password as string
          );
          if (!passwordCorrect) {
            throw new Error("Incorrect credentials!");
          }
        }
        // return some data used for make up JWT token;
        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
});
