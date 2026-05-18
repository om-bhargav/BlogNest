import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },

      include: {
        _count: {
          select: {
            blogs: true,
            followers: true,
            following: true,
          },
        },

        blogs: {
          orderBy: {
            createdAt: "desc",
          },

          take: 5,

          select: {
            id: true,
            title: true,
            excerpt: true,
            image: true,
            createdAt: true,

            author: {
              select: {
                id: true,
                name: true,
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
        },
      },
    });

    if (!user) {
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

    return NextResponse.json({
      success: true,

      data: {
        id: user.id,

        name: user.name,

        image: user.image,

        headline: user.headline,

        bio: user.bio,

        stats: {
          blogs: user._count.blogs,

          followers: user._count.followers,

          following: user._count.following,
        },

        recentBlogs: user.blogs.map((blog) => ({
          id: blog.id,

          title: blog.title,

          excerpt: blog.excerpt,

          image: blog.image,

          createdAt: blog.createdAt,

          author: blog.author,

          category: blog.category,

          _count: {
            likes: blog._count.likes,
            comments: blog._count.comments,
          },
        })),
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}