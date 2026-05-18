import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const session = await auth();
    const userId = session?.user?.id;

    const blog = await prisma.blog.findUnique({
      where: { id },

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

        _count: {
          select: {
            likes: true,
            comments: true,
            savedBy: true,
          },
        },

        // 👇 user-specific relations
        likes: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,

        savedBy: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
      },
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: blog.id,
        title: blog.title,
        content: blog.content,
        image: blog.image,
        createdAt: blog.createdAt,

        author: blog.author.name,
        authorId: blog.author.id,
        authorImage: blog.author.image,

        category: blog.category?.name,

        likes: blog._count.likes,
        comments: blog._count.comments,

        // 🔥 NEW IMPORTANT FIELDS
        liked: userId ? blog.likes.length > 0 : false,
        saved: userId ? blog.savedBy.length > 0 : false,
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}