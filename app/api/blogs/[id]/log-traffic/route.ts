import { NextResponse } from "next/server";

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
    const { id } = await params;

    // check blog exists
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

    // increment views
    const updatedBlog = await prisma.blog.update({
      where: {
        id,
      },

      data: {
        views: {
          increment: 1,
        },
      },

      select: {
        id: true,
        views: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Traffic logged successfully",

      data: {
        blogId: updatedBlog.id,
        views: updatedBlog.views,
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