import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiAuth } from "@/lib/api-auth";

/**
 * @swagger
 * /api/robot/mode:
 *   patch:
 *     summary: Update robot operating mode
 *     description: Closes the current mode usage log and starts a new one with the specified mode.
 *     tags: [Robot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mode:
 *                 type: string
 *                 enum: [STUDY, GAME, MUSIC, GENERAL]
 *     responses:
 *       200:
 *         description: Mode updated successfully
 *       400:
 *         description: Mode is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Robot not found
 *       500:
 *         description: Internal server error
 */
export async function PATCH(req: Request) {
  try {
    const { user, robot } = await getApiAuth(req);

    if (!user || !robot) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { mode } = await req.json();

    if (!mode) {
      return new NextResponse("Mode is required", { status: 400 });
    }

    const robotId = robot.id;

    // 1. End any existing active mode sessions
    await prisma.modeUsageLog.updateMany({
      where: {
        robot_id: robotId,
        end_time: null,
      },
      data: {
        end_time: new Date(),
      },
    });

    // 2. Start a new mode session
    const newLog = await prisma.modeUsageLog.create({
      data: {
        robot_id: robotId,
        mode: mode.toUpperCase(),
      },
    });

    return NextResponse.json(newLog);
  } catch (error) {
    console.error("[ROBOT_MODE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
