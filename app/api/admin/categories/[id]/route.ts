import { z } from "zod";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getAdmin } from "@/lib/auth-helpers";

const updateCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),

  description: z.string().min(10, "Description must be at least 10 characters"),

  status: z.enum(["ACTIVE", "HIDDEN"]),
});

type Params = {
  params: Promise<{
    id: string;
  }>;
};

/*
=====================================
PUT
=====================================
*/

export async function PUT(request: Request, { params }: Params) {
  try {
    const admin = await getAdmin();

    if (!admin) {
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

    const body = await request.json();

    const validated = updateCategorySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,

          message: "Validation failed",

          errors: validated.error.flatten(),
        },

        {
          status: 400,
        }
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id,
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

    const updated = await prisma.category.update({
      where: {
        id,
      },

      data: validated.data,
    });

    return NextResponse.json({
      success: true,

      message: "Category updated successfully",

      errors: null,

      data: updated,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        message: "Failed to update category",

        errors: null,
      },

      {
        status: 500,
      }
    );
  }
}

/*
=====================================
DELETE
=====================================
*/

export async function DELETE(request: Request, { params }: Params) {
  try {
    const admin = await getAdmin();

    if (!admin) {
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

    const category = await prisma.category.findUnique({
      where: {
        id,
      },

      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
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

    if (category._count.blogs > 0) {
      return NextResponse.json(
        {
          success: false,

          message: "Cannot delete category with blogs",

          errors: null,
        },

        {
          status: 400,
        }
      );
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,

      message: "Category deleted successfully",

      errors: null,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        message: "Failed to delete category",

        errors: null,
      },

      {
        status: 500,
      }
    );
  }
}
