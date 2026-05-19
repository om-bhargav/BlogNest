import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const admin = await getAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        category: true,
      },
    });
    const formatted = blogs.map((blog) => {
      return {
        ...blog,
        author: blog.author.name,
        category: blog.category.name,
      };
    });
    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blogs",
      },
      { status: 500 }
    );
  }
}
