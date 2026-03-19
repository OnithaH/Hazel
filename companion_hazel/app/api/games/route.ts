import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const games = await prisma.game.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(games);
  } catch (error) {
    console.error("[GAMES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
