import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { activity_type, game_name, duration, score, result } = body;

    if (!activity_type || !game_name || duration === undefined) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: userId },
      include: { robots: true }
    });

    if (!user || user.robots.length === 0) {
      return new NextResponse("Robot not found", { status: 404 });
    }

    const robotId = user.robots[0].id;

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
