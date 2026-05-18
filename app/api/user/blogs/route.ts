import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth-helpers";

const createBlogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),

  slug: z
    .string()
    .min(3, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers and hyphens"
    ),

  excerpt: z.string().max(300, "Excerpt too long").optional(),

  content: z.string().min(50, "Content must be at least 50 characters"),

  image: z.string().optional(),

  categoryId: z.string().min(1),

  featured: z.boolean().optional(),

  status: z.enum(["PUBLISHED", "DRAFT"]),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get("search") || "";

    const category = searchParams.get("category");

    const where = {

      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive" as const,
            },
          },

          {
            content: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),

      ...(category && {
        categoryId: category,
      }),
    };

    const blogs = await prisma.blog.findMany({
      where,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },

        category: true,

        _count: {
          select: {
            likes: true,
            comments: true,
            savedBy: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,

      message: "Blogs fetched successfully",

      errors: null,

      data: blogs,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        message: "Failed to fetch blogs",

        errors: null,
      },
      {
        status: 500,
      }
    );
  }
}
/*
=========================================
CREATE BLOG
=========================================
*/

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    /*
    =========================================
    VALIDATE BODY
    =========================================
    */

    const validated = createBlogSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,

          message: "Validation failed",

          errors: validated.error.flatten().fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const data = validated.data;

    /*
    =========================================
    CHECK CATEGORY
    =========================================
    */

    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,

          message: "Category not found",

          errors: null,
        },
        {
          status: 404,
        }
      );
    }

    /*
    =========================================
    CHECK SLUG
    =========================================
    */

    const existingBlog = await prisma.blog.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existingBlog) {
      return NextResponse.json(
        {
          success: false,

          message: "Slug already exists",

          errors: {
            slug: ["Slug already exists"],
          },
        },
        {
          status: 400,
        }
      );
    }

    /*
    =========================================
    CREATE BLOG
    =========================================
    */

    const blog = await prisma.blog.create({
      data: {
        title: data.title,

        slug: data.slug,

        excerpt: data.excerpt,

        content: data.content,

        image: data.image,

        categoryId: data.categoryId,

        featured: user.role === "ADMIN" ? data.featured || false : false,

        status: data.status,

        authorId: user.id,
      },

      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },

        category: true,
      },
    });

    return NextResponse.json(
      {
        success: true,

        message: "Blog created successfully",

        errors: null,

        data: blog,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        message: "Failed to create blog",

        errors: null,
      },
      {
        status: 500,
      }
    );
  }
}
