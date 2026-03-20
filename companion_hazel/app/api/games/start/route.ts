import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
/**
 * @swagger
 * /api/games/start:
 *   post:
 *     summary: Start a game or breathing activity
 *     description: Updates the active robot mode to signal the hardware to start the activity.
 *     tags:
 *       - Games
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activity_type:
 *                 type: string
 *               game_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hardware state updated successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Robot not found
 *       500:
 *         description: Server error
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { game_name, activity_type } = body;

    if (!game_name || !activity_type) {
      return new NextResponse("Missing game_name or activity_type", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: userId },
      include: { robots: true }
    });

    if (!user || user.robots.length === 0) {
      return new NextResponse("Robot not found", { status: 404 });
    }

    const robotId = user.robots[0].id;
    
    // Conclude any existing active mode for this robot
    await prisma.modeUsageLog.updateMany({
      where: {
        robot_id: robotId,
        end_time: null
      },
      data: {
        end_time: new Date()
      }
    });

    // Start new mode
    // E.g., "GAME: Find me Home" or "BREATHING: Box Breathing"
    const modeName = activity_type === 'BREATHING' ? `BREATHING: ${game_name}` : `GAME: ${game_name}`;
    
    const usageLog = await prisma.modeUsageLog.create({
      data: {
        robot_id: robotId,
        mode: modeName
      }
    });

    return NextResponse.json(usageLog);
  } catch (error) {
    console.error("[GAMES_START_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
