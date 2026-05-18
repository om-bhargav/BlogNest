// app/api/profile/route.ts

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth-helpers";

import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  headline: z.string().max(120).optional(),
  bio: z.string().max(1000).optional(),
  image: z.string().optional(),
});

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
        { status: 401 }
      );
    }

    const profile = await prisma.user.findUnique({
      where: {
        id: user.id,
      },

      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        headline: true,
        role: true,
        status: true,
        _count: {
          select: {
            blogs: true,
            followers: true,
            following: true,
            savedBlogs: true,
            blogLikes: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile fetched successfully",
      errors: null,

      data: {
        ...profile,

        stats: {
          blogs: profile?._count.blogs || 0,
          followers:
            profile?._count.followers || 0,
          following:
            profile?._count.following || 0,
          saved:
            profile?._count.savedBlogs || 0,
          likes:
            profile?._count.blogLikes || 0,
        },
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch profile",
        errors: null,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest
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
        { status: 401 }
      );
    }

    const body = await request.json();

    const validated =
      updateProfileSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",

          errors:
            validated.error.flatten()
              .fieldErrors,
        },
        { status: 400 }
      );
    }

    const emailExists =
      await prisma.user.findFirst({
        where: {
          email: validated.data.email,
          NOT: {
            id: user.id,
          },
        },
      });

    if (emailExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
          errors: {
            email: [
              "Email already exists",
            ],
          },
        },
        { status: 400 }
      );
    }

    const updatedUser =
      await prisma.user.update({
        where: {
          id: user.id,
        },

        data: validated.data,

        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          headline: true,
          image: true,
          role: true,
          status: true,
        },
      });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      errors: null,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
        errors: null,
      },
      { status: 500 }
    );
  }
}