import { z } from "zod";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getAdmin } from "@/lib/auth-helpers";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),

  description: z.string().min(10, "Description must be at least 10 characters"),
});

export async function POST(request: Request) {
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

    const body = await request.json();

    const validated = categorySchema.safeParse(body);

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

    const { name, description } = validated.data;

    const exists = await prisma.category.findUnique({
      where: {
        name,
      },
    });

    if (exists) {
      return NextResponse.json(
        {
          success: false,

          message: "Category already exists",

          errors: null,
        },

        {
          status: 409,
        }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({
      success: true,

      message: "Category created successfully",

      errors: null,

      data: category,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        message: "Failed to create category",

        errors: null,
      },

      {
        status: 500,
      }
    );
  }
}
