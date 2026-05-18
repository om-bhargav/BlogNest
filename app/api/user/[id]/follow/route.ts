import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(req: Request, { params }: Params) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await params;

    const currentUserId = session.user.id;

    if (currentUserId === id) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot follow yourself",
        },
        {
          status: 400,
        }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: id,
        },
      },
    });

    // UNFOLLOW
    if (existingFollow) {
      await prisma.userFollow.delete({
        where: {
          id: existingFollow.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: "User unfollowed successfully",
        data: {
          following: false,
        },
      });
    }

    // FOLLOW
    await prisma.userFollow.create({
      data: {
        followerId: currentUserId,
        followingId: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User followed successfully",
      data: {
        following: true,
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}