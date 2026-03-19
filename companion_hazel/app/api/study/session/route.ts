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
      include: { robots: true },
    });

    if (!user || user.robots.length === 0) {
      return new NextResponse("Robot not found", { status: 404 });
    }

    const body = await req.json();
    const { 
      duration, 
      break_activity, 
      phone_detection_enabled, 
      focus_shield_enabled,
      focus_goal 
    } = body;

    if (!duration) {
      return new NextResponse("Duration is required", { status: 400 });
    }

    const session = await prisma.studySession.create({
      data: {
        robot_id: user.robots[0].id,
        scheduled_duration: duration,
        break_activity,
        phone_detection_enabled: !!phone_detection_enabled,
        focus_shield_enabled: !!focus_shield_enabled,
        focus_goal: focus_goal || null,
        start_time: new Date(),
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("[STUDY_SESSION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
