import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { users } from "./db/usersSchema";
import db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { authenticator } from "otplib";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        token: {},
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
          // add for one-time check
          if (user.twoFactorActivated) {
            const tokenValid = authenticator.check(
              credentials.token as string,
              user.twoFactorSecret ?? ""
            );

            if (!tokenValid) {
              return {
                error: true,
                message: "Invalid OTP!",
              };
            }
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
});
