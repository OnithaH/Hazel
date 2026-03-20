import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/study/history
 * Description: Fetches the logged-in user's past focus sessions and distraction counts.
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: userId },
      include: {
        robots: true,
      },
    });

    if (!user || user.robots.length === 0) {
      return new NextResponse("No robot found for this user", { status: 404 });
    }

    const robotId = user.robots[0].id;

    const sessions = await prisma.studySession.findMany({
      where: {
        robot_id: robotId,
      },
      include: {
        _count: {
          select: { distractions: true },
        },
      },
      orderBy: {
        start_time: 'desc',
      },
    });

    // Formatting response to match requirements
    const formattedSessions = sessions.map((session: any) => ({
      id: session.id,
      date: session.start_time,
      duration: session.scheduled_duration,
      actual_focus_time: session.actual_focus_time,
      distractions_count: session._count?.distractions || 0,
      break_used: session.break_used,
      end_time: session.end_time,
    }));

    return NextResponse.json(formattedSessions);
  } catch (error) {
    console.error("[STUDY_HISTORY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
