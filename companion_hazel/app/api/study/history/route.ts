import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiAuth } from "@/lib/api-auth";

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
export async function GET(req: Request) {
  try {
    const { user, robot } = await getApiAuth(req);

    if (!user || !robot) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const robotId = robot.id;

    // Auto-delete sessions older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await prisma.studySession.deleteMany({
      where: {
        robot_id: robotId,
        start_time: {
          lt: thirtyDaysAgo,
        },
      },
    });

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
