import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiAuth } from "@/lib/api-auth";
/**
 * @swagger
 * /api/games/log:
 *   post:
 *     summary: Log a game session
 *     description: Saves the result and duration of a completed Game or Breathing activity.
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
 *               duration:
 *                 type: integer
 *               score:
 *                 type: integer
 *                 nullable: true
 *               result:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Game session successfully logged
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
    const { user, robot } = await getApiAuth(req);
    if (!user || !robot) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const robotId = robot.id;
    const body = await req.json();
    const { activity_type, game_name, duration, score, result } = body;

    if (!activity_type || !game_name || duration === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const gameSession = await prisma.gameSession.create({
      data: {
        robot_id: robotId,
        activity_type,
        game_name,
        duration: parseInt(duration),
        score: score ? parseInt(score) : null,
        result
      }
    });

    return NextResponse.json(gameSession);
  } catch (error) {
    console.error("[GAMES_LOG_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
