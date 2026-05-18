// app/api/comments/route.ts

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUser } from "@/lib/auth-helpers";

import { z } from "zod";

const createCommentSchema = z.object({
  comment: z
    .string()
    .min(1, "Comment is required")
    .max(500, "Comment too long"),
});

const updateCommentSchema = z.object({
  comment: z
    .string()
    .min(1, "Comment is required")
    .max(500, "Comment too long"),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blogId = id;

    if (!blogId) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog id is required",
          errors: {
            blogId: ["Blog id is required"],
          },
        },
        {
          status: 400,
        }
      );
    }

    const comments = await prisma.blogComment.findMany({
      where: {
        blogId,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Comments fetched successfully",
      errors: null,
      data: comments,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch comments",
        errors: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id: blogId } = await params;

    const body = await request.json();

    const validated = createCommentSchema.safeParse(body);

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

    const blog = await prisma.blog.findFirst({
      where: {
        id: blogId,
        status: "PUBLISHED",
      },
    });

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
          errors: {
            blogId: ["Invalid blog"],
          },
        },
        {
          status: 404,
        }
      );
    }

    const comment = await prisma.blogComment.create({
      data: {
        blogId: blogId,

        comment: validated.data.comment,

        userId: user.id,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Comment added successfully",
        errors: null,
        data: comment,
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
        message: "Failed to create comment",
        errors: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Comment id is required",
          errors: {
            id: ["Comment id is required"],
          },
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const validated = updateCommentSchema.safeParse(body);

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

    const existingComment = await prisma.blogComment.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingComment) {
      return NextResponse.json(
        {
          success: false,
          message: "Comment not found",
          errors: null,
        },
        {
          status: 404,
        }
      );
    }

    const updatedComment = await prisma.blogComment.update({
      where: {
        id,
      },

      data: {
        comment: validated.data.comment,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Comment updated successfully",
      errors: null,
      data: updatedComment,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update comment",
        errors: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Comment id is required",
          errors: {
            id: ["Comment id is required"],
          },
        },
        {
          status: 400,
        }
      );
    }

    const existingComment = await prisma.blogComment.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingComment) {
      return NextResponse.json(
        {
          success: false,
          message: "Comment not found",
          errors: null,
        },
        {
          status: 404,
        }
      );
    }

    await prisma.blogComment.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
      errors: null,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete comment",
        errors: null,
      },
      {
        status: 500,
      }
    );
  }
}
