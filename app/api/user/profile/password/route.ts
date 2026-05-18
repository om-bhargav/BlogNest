// app/api/profile/password/route.ts

import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth-helpers";

import { z } from "zod";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6),

    newPassword: z.string().min(6),

    confirmPassword: z.string().min(6),
  })
  .refine(
    (data) =>
      data.newPassword ===
      data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

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
      passwordSchema.safeParse(body);

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

    const existingUser =
      await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          errors: null,
        },
        { status: 404 }
      );
    }

    const isCorrect =
      await bcrypt.compare(
        validated.data.currentPassword,
        existingUser.password
      );

    if (!isCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid current password",

          errors: {
            currentPassword: [
              "Invalid current password",
            ],
          },
        },
        { status: 400 }
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        validated.data.newPassword,
        10
      );

    await prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
      errors: null,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update password",
        errors: null,
      },
      { status: 500 }
    );
  }
}