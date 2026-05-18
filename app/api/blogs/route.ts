import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "All";
    const sort = searchParams.get("sort") || "latest";

    const blogs = await prisma.blog.findMany({
      where: {
        status: "PUBLISHED",

        // 🔍 Search filter
        ...(search
          ? {
              title: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {}),

        // 🏷 Category filter
        ...(category !== "All"
          ? {
              category: {
                name: category,
              },
            }
          : {}),
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

        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    // 📊 Sorting in memory (simple + flexible)
    const sorted = blogs.sort((a, b) => {
      if (sort === "popular") {
        return b._count.likes - a._count.likes;
      }

      // latest default
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

    return NextResponse.json({
      success: true,
      data: sorted.map((b) => ({
        id: b.id,
        title: b.title,
        excerpt: b.excerpt,
        image: b.image,
        date: b.createdAt,
        views: b.views ?? 0,
        category: b.category?.name,
        author: b.author?.name,
        likes: b._count.likes,
        comments: b._count.comments,
      })),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blogs",
      },
      { status: 500 }
    );
  }
}