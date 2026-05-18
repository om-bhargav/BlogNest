import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth-helpers";

import { z } from "zod";

const updateBlogSchema = z.object({
  title: z.string().min(3, "Title is required"),

  slug: z.string().min(3, "Slug is required"),

  excerpt: z.string().optional(),

  content: z.string().min(20, "Content is required"),

  image: z.string().optional(),

  categoryId: z.string().min(1, "Category is required"),

  featured: z.boolean().optional(),

  status: z.enum(["PUBLISHED", "DRAFT", "BLOCKED"]),
});

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
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

    const { id } = await params;

    const blog = await prisma.blog.findFirst({
      where: {
        id,
        authorId: user.id,
      },

      include: {
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

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
          errors: null,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog fetched successfully",
      errors: null,
      data: blog,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blog",
        errors: null,
      },
      {
        status: 500,
      }
    );
  }
}



export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
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

    const validated = updateBlogSchema.safeParse(body);

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

    const { id } = await params;

    const existingBlog = await prisma.blog.findFirst({
      where: {
        id,
        authorId: user.id,
      },
    });

    if (!existingBlog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
          errors: null,
        },
        {
          status: 404,
        }
      );
    }

    const slugExists = await prisma.blog.findFirst({
      where: {
        slug: validated.data.slug,

        NOT: {
          id,
        },
      },
    });

    if (slugExists) {
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

    const category = await prisma.category.findFirst({
      where: {
        id: validated.data.categoryId,
        status: "ACTIVE",
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category",
          errors: {
            categoryId: ["Category not found"],
          },
        },
        {
          status: 400,
        }
      );
    }

    const updatedBlog = await prisma.blog.update({
      where: {
        id,
      },

      data: validated.data,

      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      errors: null,
      data: updatedBlog,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update blog",
        errors: null,
      },
      {
        status: 500,
      }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
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

    const { id } = await params;

    const blog = await prisma.blog.findFirst({
      where: {
        id,
        authorId: user.id,
      },
    });

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
          errors: null,
        },
        {
          status: 404,
        }
      );
    }

    await prisma.blog.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
      errors: null,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete blog",
        errors: null,
      },
      {
        status: 500,
      }
    );
  }
}
