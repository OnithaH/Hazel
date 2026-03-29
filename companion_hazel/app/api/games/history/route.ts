import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiAuth } from "@/lib/api-auth";
/**
 * @swagger
 * /api/games/history:
 *   get:
 *     summary: Get recent game history
 *     description: Fetches the last 10 game sessions played by the user's robot.
 *     tags:
 *       - Games
 *     responses:
 *       200:
 *         description: List of recent game sessions
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Robot not found
 *       500:
 *         description: Server error
 */
export async function GET(req: Request) {
  try {
    const { user, robot } = await getApiAuth(req);
    if (!user || !robot) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const robotId = robot.id;

    const history = await prisma.gameSession.findMany({
      where: { robot_id: robotId },
      orderBy: { played_at: 'desc' },
      take: 10
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("[GAMES_HISTORY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
