import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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

    let user = await prisma.user.findUnique({
      where: { clerk_id: userId },
      include: { robots: true },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    let robotId: string;

    if (user.robots.length === 0) {
      // Create a default robot for the user so they can still save sessions
      try {
        const newRobot = await prisma.robot.create({
          data: {
            name: `${user.name || 'My'}'s Robot`,
            user_id: user.id,
          }
        });
        robotId = newRobot.id;
      } catch (e) {
        console.error("Robot Create Error:", e);
        throw new Error("Failed to create default robot for scheduling.");
      }
    } else {
      robotId = user.robots[0].id;
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
        robot_id: robotId,
        scheduled_duration: duration,
        break_activity,
        phone_detection_enabled: !!phone_detection_enabled,
        focus_shield_enabled: !!focus_shield_enabled,
        focus_goal: focus_goal || null,
        start_time: start_time ? new Date(start_time) : new Date(),
      },
    }).catch(e => {
      console.error("Session Create Error:", e);
      throw new Error("Database error creating session.");
    });

    return NextResponse.json(session);
  } catch (error: any) {
    console.error("[STUDY_SESSION_POST]", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}

/**
 * @swagger
 * /api/study/session:
 *   get:
 *     summary: Get current active study session
 *     description: Retrieves the most recent study session that hasn't ended yet for the authenticated user.
 *     tags: [Study]
 *     responses:
 *       200:
 *         description: Successfully retrieved current session (or null if none)
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
      include: { robots: true },
    });

    if (!user || user.robots.length === 0) {
      return NextResponse.json(null);
    }

    const session = await prisma.studySession.findFirst({
      where: {
        robot_id: user.robots[0].id,
        end_time: null,
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

    return NextResponse.json(session);
  } catch (error) {
    console.error("[STUDY_SESSION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

/**
 * @swagger
 * /api/study/session:
 *   patch:
 *     summary: End a study session
 *     description: Updates an active study session with an end time.
 *     tags: [Study]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session ended successfully
 *       400:
 *         description: Session ID is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 *       500:
 *         description: Internal server error
 */
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return new NextResponse("Session ID is required", { status: 400 });
    }

    const session = await prisma.studySession.update({
      where: { id: sessionId },
      data: {
        end_time: new Date(),
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("[STUDY_SESSION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
