import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/auth-helpers";
import { z } from "zod";

const schema = z.object({
  role: z.enum(["ADMIN", "USER"]).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED"]).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdmin();
    const { id } = await params;
    if (!admin) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const body = await req.json();
    const validated = schema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: id },
      data: validated.data,
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdmin();
    const { id } = await params;
    if (!admin) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    await prisma.user.delete({
      where: { id: id },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}
