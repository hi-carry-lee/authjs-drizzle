import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { Label } from "@/components/ui/label";
import Link from "next/link";

async function MyAccount() {
  const session = await auth();
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>My Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Email:</Label>
        <div className="text-muted-foreground">{session?.user?.email}</div>
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
