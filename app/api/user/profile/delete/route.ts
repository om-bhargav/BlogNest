// app/api/profile/delete/route.ts

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth-helpers";
import { signOut } from "@/lib/auth";
export async function DELETE() {
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

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
    signOut({ redirect: true, redirectTo: "/" });
    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
      errors: null,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete account",
        errors: null,
      },
      { status: 500 }
    );
  }
}
