import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 items-center mt-72">
      <h1 className="text-4xl font-bold">Auth.js demo project</h1>
      <p>A project used to practice Auth.js and Drizzle</p>
      <Button asChild>
        <Link href="/login">Go to login</Link>
      </Button>
    </div>
  );
}
