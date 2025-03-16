import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import db from "@/db/drizzle";
import TwoFactor from "./_two-factor/two-factor";
import { users } from "@/db/usersSchema";
import { eq } from "drizzle-orm";

async function MyAccount() {
  const session = await auth();
  if (!session?.user) {
    return;
  }
  const [user] = await db
    .select({
      twoFactorActivated: users.twoFactorActivated,
    })
    .from(users)
    .where(eq(users.id, parseInt(session?.user?.id ?? "")));

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>My Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Email:</Label>
        <div className="text-muted-foreground">{session?.user?.email}</div>

        <TwoFactor twoFactorActivated={user.twoFactorActivated ?? false} />
        <div className="border mt-2"></div>
        <div className="mt-2">
          <Link
            href="/change-password"
            className="text-muted-foreground text-sm"
          >
            Change your password
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default MyAccount;
