import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiAuth } from "@/lib/api-auth";
/**
 * @swagger
 * /api/games/stats:
 *   get:
 *     summary: Get today's game statistics
 *     description: Aggregates daily playtime, total points, win streak, and games left.
 *     tags:
 *       - Games
 *     responses:
 *       200:
 *         description: Daily game statistics
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

    // Calculate today's boundaries
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Aggregate today's stats
    const stats = await prisma.gameSession.aggregate({
      where: {
        robot_id: robotId,
        played_at: {
          gte: today,
          lt: tomorrow
        }
      },
      _sum: {
        duration: true,
        score: true
      },
      _count: true
    });

    const playTimeMinutes = stats._sum.duration ? Math.floor(stats._sum.duration / 60) : 0;
    const totalPoints = stats._sum.score || 0;
    const gamesPlayedToday = stats._count || 0;
    const gamesLeft = Math.max(0, 5 - gamesPlayedToday); 

    // Calculate win streak from recent games
    const recentGames = await prisma.gameSession.findMany({
      where: { robot_id: robotId },
      orderBy: { played_at: 'desc' },
      select: { result: true }
    });

    let winStreak = 0;
    for (const game of recentGames) {
      if (game.result === 'Win') {
        winStreak++;
      } else {
        break;
      }
    }

    return NextResponse.json({
      playTimeToday: `${playTimeMinutes}m`, // Format for UI
      totalPoints,
      winStreak,
      gamesLeft: `${gamesLeft}/5` // Format for UI
    });
  } catch (error) {
    console.error("[GAMES_STATS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
