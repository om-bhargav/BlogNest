import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: Request,
  { params }: Params
) {
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

    const currentUserId = session.user.id;

    const { id } = await params;

    const followedUsers = await prisma.userFollow.findMany({
      where: {
        followerId: id,
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        following: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            headline: true,
            role: true,
            status: true,
            createdAt: true,

            followers: {
              where: {
                followerId: currentUserId,
              },

              select: {
                id: true,
              },
            },

            _count: {
              select: {
                followers: true,
                following: true,
                blogs: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Followed users fetched successfully",

      data: followedUsers.map(({ following }) => ({
        id: following.id,
        name: following.name,
        email: following.email,
        image: following.image,
        bio: following.bio,
        headline: following.headline,
        role: following.role,
        status: following.status,
        createdAt: following.createdAt,

        counts: following._count,

        isFollowing:
          following.followers.length > 0,
      })),
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