import { auth } from "@/lib/auth";
import { User } from "next-auth";
import { prisma } from "./prisma";

export async function getUser(): Promise<(User | null)> {
  const session = await auth();

  if (!session?.user) {
    return null;
  }
  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where:{
      id: userId
    },
    select:{
      name: true,
      role: true,
      id: true,
      bio: true,
      email: true,
      image: true,
      status: true
    }
  })
  return user;
}

export async function getAdmin() {
  const user = await getUser();

  if (!user) {
    return null;
  }
  if (user.role !== "ADMIN") {
    return null;
  }

  return user;
}