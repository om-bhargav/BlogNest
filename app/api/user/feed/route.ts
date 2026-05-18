import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
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

    /*
    =====================================
    FOLLOWED USERS
    =====================================
    */

    const following = await prisma.userFollow.findMany({
      where: {
        followerId: currentUserId,
      },

      select: {
        followingId: true,
      },
    });

    const followingIds = following.map((f) => f.followingId);

    /*
    =====================================
    FEED BLOGS
    =====================================
    */

    const blogs = await prisma.blog.findMany({
      where: {
        authorId: {
          in: followingIds,
        },

        status: "PUBLISHED",
      },

      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            headline: true,
          },
        },

        category: {
          select: {
            id: true,
            name: true,
          },
        },

        likes: {
          where: {
            userId: currentUserId,
          },

          select: {
            id: true,
          },
        },

        savedBy: {
          where: {
            userId: currentUserId,
          },

          select: {
            id: true,
          },
        },

        _count: {
          select: {
            likes: true,
            comments: true,
            savedBy: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Feed fetched successfully",

      data: blogs.map((blog) => ({
        ...blog,

        liked: blog.likes.length > 0,

        saved: blog.savedBy.length > 0,

        likes: undefined,

        savedBy: undefined,
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
