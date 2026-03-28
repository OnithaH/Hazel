import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { ensureUserAndRobot } from "@/lib/userSync";

/**
 * @swagger
 * /api/study/session:
 *   post:
 *     summary: Start a new study session
 *     description: Creates a new study session record for the authenticated user and their linked robot.
 *     tags: [Study]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               duration:
 *                 type: integer
 *               break_activity:
 *                 type: string
 *               phone_detection_enabled:
 *                 type: boolean
 *               focus_shield_enabled:
 *                 type: boolean
 *               focus_goal:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session created successfully
 *       400:
 *         description: Duration is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Robot not found
 *       500:
 *         description: Internal server error
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await ensureUserAndRobot(userId);

    if (!user || user.robots.length === 0) {
      return new NextResponse("Failed to synchronize user/robot", { status: 500 });
    }

    const body = await req.json();
    const {
      duration,
      break_activity,
      phone_detection_enabled,
      focus_shield_enabled,
      focus_goal,
      start_time
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
        start_time: start_time ? new Date(start_time) : new Date(),
      },
    });

    // If start_time is in the future, also create a Reminder record for the General mode
    if (start_time && new Date(start_time) > new Date()) {
      const startDate = new Date(start_time);
      // Format time as HH:mm
      const hours = startDate.getHours().toString().padStart(2, '0');
      const minutes = startDate.getMinutes().toString().padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;

      await prisma.reminder.create({
        data: {
          robot_id: user.robots[0].id,
          title: focus_goal || "Study Session",
          date: startDate,
          time: timeStr,
          type: "Study",
        },
      });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("[STUDY_SESSION_POST] Critical error:", error);
    return new NextResponse(`Internal Error: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
  }
}
