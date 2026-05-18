import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

    const savedBlogs = await prisma.savedBlog.findMany({
      where: {
        userId: session.user.id,
      },

      include: {
        blog: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },

            author: {
              select: {
                id: true,
                name: true,
                image: true,
                headline: true,
              },
            },

            likes: {
              where: {
                userId: session.user.id,
              },

              select: {
                id: true,
              },
            },

            savedBy: {
              where: {
                userId: session.user.id,
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
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Saved blogs fetched successfully",

      data: savedBlogs.map((item) => ({
        ...item.blog,

        isLiked: item.blog.likes.length > 0,

        isSaved: item.blog.savedBy.length > 0,

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