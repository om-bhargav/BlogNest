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

    const userId = session.user.id;

    const blog = await prisma.blog.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
      },
    });

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        {
          status: 404,
        }
      );
    }

    const existingLike = await prisma.blogLike.findUnique({
      where: {
        userId_blogId: {
          userId,
          blogId: id,
        },
      },
    });

    // UNLIKE
    if (existingLike) {
      await prisma.blogLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Blog unliked successfully",

        data: {
          liked: false,
        },
      });
    }

    // LIKE
    await prisma.blogLike.create({
      data: {
        userId,
        blogId: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Blog liked successfully",

      data: {
        liked: true,
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