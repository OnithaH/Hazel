import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: userId },
      include: { robots: true }
    });

    if (!user || user.robots.length === 0) {
      return new NextResponse("Robot not found", { status: 404 });
    }

    const robotId = user.robots[0].id;

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
