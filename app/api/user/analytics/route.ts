// app/api/analytics/route.ts

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
  getAdmin,
  getUser,
} from "@/lib/auth-helpers";

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
          errors: null,
        },
        {
          status: 401,
        }
      );
    }

    const admin = await getAdmin();

    if (admin) {
      const [
        totalUsers,
        totalBlogs,
        totalCategories,
        totalLikes,
        totalSavedBlogs,
        totalComments,
        totalViews,
        activeUsers,
        suspendedUsers,
        publishedBlogs,
        blockedBlogs,
        draftBlogs,
        featuredBlogs,
        traffic,
        recentUsers,
        recentBlogs,
      ] = await Promise.all([
        prisma.user.count(),

        prisma.blog.count(),

        prisma.category.count(),

        prisma.blogLike.count(),

        prisma.savedBlog.count(),

        prisma.blogComment.count(),

        prisma.blog.aggregate({
          _sum: {
            views: true,
          },
        }),

        prisma.user.count({
          where: {
            status: "ACTIVE",
          },
        }),

        prisma.user.count({
          where: {
            status: "SUSPENDED",
          },
        }),

        prisma.blog.count({
          where: {
            status: "PUBLISHED",
          },
        }),

        prisma.blog.count({
          where: {
            status: "BLOCKED",
          },
        }),

        prisma.blog.count({
          where: {
            status: "DRAFT",
          },
        }),

        prisma.blog.count({
          where: {
            featured: true,
          },
        }),

        prisma.logTraffic.findMany({
          orderBy: {
            date: "asc",
          },

          take: 7,
        }),

        prisma.user.findMany({
          take: 5,

          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        }),

        prisma.blog.findMany({
          take: 5,

          orderBy: {
            createdAt: "desc",
          },

          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        }),
      ]);

      return NextResponse.json({
        success: true,

        message:
          "Admin analytics fetched successfully",

        errors: null,

        data: {
          role: "ADMIN",

          overview: {
            totalUsers,
            totalBlogs,
            totalCategories,
            totalLikes,
            totalSavedBlogs,
            totalComments,
            totalViews:
              totalViews._sum.views || 0,
          },

          users: {
            activeUsers,
            suspendedUsers,
          },

          blogs: {
            publishedBlogs,
            blockedBlogs,
            draftBlogs,
            featuredBlogs,
          },

          charts: {
            traffic,
          },

          recent: {
            recentUsers,
            recentBlogs,
          },
        },
      });
    }

    /*
    =========================================
    USER ANALYTICS
    =========================================
    */

    const [
      myBlogs,
      publishedBlogs,
      draftBlogs,
      blockedBlogs,
      totalViews,
      totalLikes,
      totalSaved,
      totalFollowers,
      totalFollowing,
      totalComments,
      topBlogs,
      recentBlogs,
    ] = await Promise.all([
      prisma.blog.count({
        where: {
          authorId: user.id,
        },
      }),

      prisma.blog.count({
        where: {
          authorId: user.id,
          status: "PUBLISHED",
        },
      }),

      prisma.blog.count({
        where: {
          authorId: user.id,
          status: "DRAFT",
        },
      }),

      prisma.blog.count({
        where: {
          authorId: user.id,
          status: "BLOCKED",
        },
      }),

      prisma.blog.aggregate({
        where: {
          authorId: user.id,
        },

        _sum: {
          views: true,
        },
      }),

      prisma.blogLike.count({
        where: {
          blog: {
            authorId: user.id,
          },
        },
      }),

      prisma.savedBlog.count({
        where: {
          userId: user.id,
        },
      }),

      prisma.userFollow.count({
        where: {
          followingId: user.id,
        },
      }),

      prisma.userFollow.count({
        where: {
          followerId: user.id,
        },
      }),

      prisma.blogComment.count({
        where: {
          blog: {
            authorId: user.id,
          },
        },
      }),

      prisma.blog.findMany({
        where: {
          authorId: user.id,
        },

        orderBy: {
          views: "desc",
        },

        take: 5,

        select: {
          id: true,
          title: true,
          views: true,
          createdAt: true,
        },
      }),

      prisma.blog.findMany({
        where: {
          authorId: user.id,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 5,

        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,

      message:
        "User analytics fetched successfully",

      errors: null,

      data: {
        role: "USER",

        overview: {
          myBlogs,
          publishedBlogs,
          draftBlogs,
          blockedBlogs,
          totalViews:
            totalViews._sum.views || 0,
          totalLikes,
          totalSaved,
          totalFollowers,
          totalFollowing,
          totalComments,
        },

        topBlogs,

        recentBlogs,
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch analytics",
        errors: null,
      },
      {
        status: 500,
      }
    );
  }
}