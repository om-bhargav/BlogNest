import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.logTraffic.findUnique({
      where: { date: today },
    });

    if (existing) {
      await prisma.logTraffic.update({
        where: { date: today },
        data: {
          views: { increment: 1 },
        },
      });
    } else {
      await prisma.logTraffic.create({
        data: {
          date: today,
          views: 1,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "View tracked",
      data: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to track view",
        data: null,
      },
      { status: 500 }
    );
  }
}