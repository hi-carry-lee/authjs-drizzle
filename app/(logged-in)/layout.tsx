import Link from "next/link";
import LogoutButton from "./logout-button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function LoggedInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  // console.log("logged in session: ", session);
  if (!session?.user?.id) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-200 flex justify-between items-center p-4">
        <ul className="flex gap-4">
          <li className="p-2 hover:bg-white rounded-lg duration-200 text-xl font-semibold">
            <Link href="/my-account">My Account</Link>
          </li>
          <li className="p-2 hover:bg-white rounded-lg duration-200 text-xl font-semibold">
            <Link href="/change-password">Change Password</Link>
          </li>
        </ul>
        <div>
          <LogoutButton />
        </div>
      </nav>
      <div className="flex-1 flex justify-center items-center">{children}</div>
    </div>
  );
}

export default LoggedInLayout;
