"use client";
import { UserContext } from "@/context/UserContext";

export default function DashboardRouter({
  admin,
  user,
}: {
  admin: React.ReactNode;
  user: React.ReactNode;
}) {
  const { user: currentUser } = UserContext();
  const role = currentUser?.role ?? "USER";
  if (role === "ADMIN") {
    return admin;
  }

  return user;
}