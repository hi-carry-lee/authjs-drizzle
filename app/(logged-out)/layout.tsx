import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function LoggedOutLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!!session?.user?.id) {
    redirect("/my-account");
  }
  return children;
}

export default LoggedOutLayout;
