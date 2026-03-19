import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: userId },
      include: { robots: true }
    });

    if (!user || user.robots.length === 0) {
      return new NextResponse("Robot not found", { status: 404 });
    }

    const robotId = user.robots[0].id;

    // Find the active study session
    const activeSession = await prisma.studySession.findFirst({
      where: {
        robot_id: robotId,
        end_time: null
      }
    });

    if (!activeSession) {
      return new NextResponse("No active study session found", { status: 404 });
    }

    // Mark break as used
    await prisma.studySession.update({
      where: { id: activeSession.id },
      data: { break_used: true }
    });

    // Conclude current active mode (which should be STUDY)
    await prisma.modeUsageLog.updateMany({
      where: {
        robot_id: robotId,
        end_time: null
      },
      data: {
        end_time: new Date()
      }
    });

    // Extract the intended break activity. If null, default to GAME.
    const breakActivity = activeSession.break_activity || 'GAME';
    
    // Start game/breathing mode for the break
    const usageLog = await prisma.modeUsageLog.create({
      data: {
        robot_id: robotId,
        mode: breakActivity
      }
    });

    return NextResponse.json({ success: true, usageLog });
  } catch (error) {
    console.error("[STUDY_TRIGGER_BREAK_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
