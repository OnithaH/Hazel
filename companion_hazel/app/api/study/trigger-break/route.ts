import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiAuth } from "@/lib/api-auth";
/**
 * @swagger
 * /api/study/trigger-break:
 *   post:
 *     summary: Trigger a study break
 *     description: Pauses an active study session and signals the hardware to start Game Mode.
 *     tags:
 *       - Study
 *     responses:
 *       200:
 *         description: Break triggered successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No active study session found / Robot not found
 *       500:
 *         description: Server error
 */
export async function POST(req: Request) {
  try {
    const { user, robot } = await getApiAuth(req);
    if (!user || !robot) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const robotId = robot.id;

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
