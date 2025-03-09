import db from "@/db/drizzle";
import { passwordResetTokens } from "@/db/passwordResetTokens";
import { eq } from "drizzle-orm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import UpdatePasswordForm from "./updatePasswordForm";

async function UpdatePassword({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  let tokenIsValid = false;

  const { token } = searchParams;
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
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>
            {tokenIsValid
              ? "Update Password"
              : "Your password reset link is invalid or has expired!"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tokenIsValid ? (
            <UpdatePasswordForm token={token ?? ""} />
          ) : (
            <Link href="/password-reset" className="underline">
              Request another password reset link
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default UpdatePassword;
