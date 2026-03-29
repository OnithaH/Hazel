import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiAuth } from "@/lib/api-auth";

/**
 * @swagger
 * /api/study/distraction:
 *   post:
 *     summary: Log study distraction
 *     description: Logs interference (phone or drowsiness) detected by the Raspberry Pi during a study session.
 *     tags: [Study]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               session_id:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [PHONE, DROWSINESS]
 *     responses:
 *       200:
 *         description: Distraction logged successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Session not found
 *       500:
 *         description: Internal server error
 */
export async function POST(req: Request) {
  try {
    const { user, robot } = await getApiAuth(req);

    if (!user || !robot) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { session_id, type } = body;

    if (!session_id || !type) {
      return new NextResponse("Session ID and type are required", { status: 400 });
    }

    // Verify session exists AND belongs to the authenticated robot
    const session = await prisma.studySession.findUnique({
      where: { id: session_id },
    });

    if (!session) {
      return new NextResponse("Session not found", { status: 404 });
    }

    if (session.robot_id !== robot.id) {
      return new NextResponse("Forbidden: You do not own this session", { status: 403 });
    }

    const distraction = await prisma.distractionLog.create({
      data: {
        session_id,
        type, // 'PHONE' or 'DROWSINESS'
      },
    });

    return NextResponse.json({ message: 'Distraction logged', data: distraction });
  } catch (error) {
    console.error("[STUDY_DISTRACTION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
