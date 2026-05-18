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

    const existingSave = await prisma.savedBlog.findUnique({
      where: {
        userId_blogId: {
          userId,
          blogId: id,
        },
      },
    });

    // UNSAVE
    if (existingSave) {
      await prisma.savedBlog.delete({
        where: {
          id: existingSave.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Blog removed from saved",

        data: {
          saved: false,
        },
      });
    }

    // SAVE
    await prisma.savedBlog.create({
      data: {
        userId,
        blogId: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Blog saved successfully",

      data: {
        saved: true,
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