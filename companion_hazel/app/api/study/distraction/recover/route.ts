import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * @swagger
 * /api/study/distraction/recover:
 *   post:
 *     summary: Recover from distraction
 *     description: Mark the active study session as no longer distracted to resume focus timer.
 *     tags: [Study]
 *     responses:
 *       200:
 *         description: Recovered successfully
 *       404:
 *         description: No active session found
 *       500:
 *         description: Internal server error
 */
export async function POST() {
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
    });

    if (!activeSession) {
      return new NextResponse("No active session found", { status: 404 });
    }

    await prisma.studySession.update({
      where: { id: activeSession.id },
      data: { is_distracted: false },
    });

    return NextResponse.json({ message: 'Recovered from distraction' });
  } catch (error) {
    console.error("[STUDY_RECOVER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
