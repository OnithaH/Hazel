import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const robotId = searchParams.get("robotId");

    if (!robotId) return new NextResponse("Missing robotId", { status: 400 });

    const aromas = await prisma.aromaConfiguration.findMany({
      where: { robot_id: robotId },
    });

    return NextResponse.json(aromas);
  } catch (error) {
    console.error("[AROMA_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { robotId, chamber_number, scent_name, intensity, color_hex } = body;

    if (!robotId || !scent_name) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const aroma = await prisma.aromaConfiguration.create({
      data: {
        robot_id: robotId,
        chamber_number: chamber_number || 1,
        scent_name,
        intensity: intensity || 50,
        color_hex: color_hex || "#AD46FF",
        isActive: false,
      },
    });

    return NextResponse.json(aroma, { status: 201 });
  } catch (error) {
    console.error("[AROMA_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
