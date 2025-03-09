"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  console.log("click log out button");
  await signOut();
};
