import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const admin = await getAdmin();
    const categories = await prisma.category.findMany({
      where: {
        status: admin ? undefined : "ACTIVE",
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,

        _count: {
          select: {
            blogs: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,

      message: "Categories fetched successfully",

      errors: null,

      data: categories,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,

        message: "Failed to fetch categories",

        errors: null,
      },

      {
        status: 500,
      }
    );
  }
}
