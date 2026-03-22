import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { action, mode } = await req.json();

    const user = await prisma.user.findUnique({
      where: { clerk_id: userId },
      include: { robots: true },
    });

    if (!user || user.robots.length === 0) {
      return new NextResponse("Robot not found", { status: 404 });
    }

    const robotId = user.robots[0].id;

    if (action === "pause") {
      // End any existing active mode sessions
      await prisma.modeUsageLog.updateMany({
        where: {
          robot_id: robotId,
          end_time: null,
        },
        data: {
          end_time: new Date(),
        },
      });
      return NextResponse.json({ message: "Usage paused" });
    }

    if (action === "resume") {
      // 1. End any existing active sessions first to avoid duplicates
      await prisma.modeUsageLog.updateMany({
        where: {
          robot_id: robotId,
          end_time: null,
        },
        data: {
          end_time: new Date(),
        },
      });

      // 2. Start a new mode session
      const newLog = await prisma.modeUsageLog.create({
        data: {
          robot_id: robotId,
          mode: (mode || "GENERAL").toUpperCase(),
        },
      });
      return NextResponse.json(newLog);
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch (error) {
    console.error("[ROBOT_USAGE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
