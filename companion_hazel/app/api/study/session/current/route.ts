import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/study/session/current:
 *   get:
 *     summary: Fetch the currently active study session
 *     description: Returns the study session that has not yet ended for the user's robot.
 *     tags: [Study]
 *     responses:
 *       200:
 *         description: Active session found
 *       404:
 *         description: No active session found or Robot not found
 *       401:
 *         description: Unauthorized
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
      include: { robots: true },
    });

    if (!user || user.robots.length === 0) {
      return new NextResponse("Robot not found", { status: 404 });
    }

    const robotId = user.robots[0].id;

    const activeSession = await prisma.studySession.findFirst({
      where: {
        robot_id: robotId,
        end_time: null,
      },
      include: {
        distractions: true,
      },
      orderBy: {
        start_time: 'desc',
      },
    });

    if (!activeSession) {
      return new NextResponse("No active study session found", { status: 404 });
    }

    return NextResponse.json(activeSession);
  } catch (error) {
    console.error("[STUDY_SESSION_CURRENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
