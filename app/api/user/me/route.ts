import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // try {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
        data: null,
      },
      { status: 401 }
    );
  }
  const id = session.user.id;
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      image: true,
      followers: {
        select: {
          follower: {
            select: {
              id: true,
              name: true,
              image: true,
              headline: true,
            },
          },
        },
      },

      // FOLLOWING
      following: {
        select: {
          following: {
            select: {
              id: true,
              name: true,
              image: true,
              headline: true,
            },
          },
        },
      },
    },
  });
  // const user = await prisma.user.findMany();
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "User not found",
        data: null,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "User fetched successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        followers: user.followers.map((f) => f.follower),
        following: user.following.map((f) => f.following),
      },
    },
    { status: 200 }
  );
  // } catch (error) {
  //   return NextResponse.json(
  //     {
  //       success: false,
  //       message: "Something went wrong",
  //       data: null,
  //     },
  //     { status: 500 }
  //   );
  // }
}
