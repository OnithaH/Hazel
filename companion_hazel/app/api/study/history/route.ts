import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/study/history:
 *   get:
 *     summary: Fetch study session history
 *     description: Retrieves a list of all past focus sessions and distraction counts for the authenticated user.
 *     tags: [Study]
 *     responses:
 *       200:
 *         description: Successfully retrieved history
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Robot not found
 *       500:
 *         description: Internal server error
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
      return NextResponse.json([]);
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
      duration: session.actual_focus_time ?? (session.end_time ? Math.floor((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 60000) : session.scheduled_duration),
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
