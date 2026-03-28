import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiAuth } from "@/lib/api-auth";
/**
 * @swagger
 * /api/games/breathing-exercises:
 *   get:
 *     summary: Get all breathing exercises
 *     description: Fetches a list of all breathing exercises from the database.
 *     tags:
 *       - Games
 *     responses:
 *       200:
 *         description: List of breathing exercises
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function GET(req: Request) {
  try {
    const { user, robot } = await getApiAuth(req);
    if (!user || !robot) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const exercises = await prisma.breathingExercise.findMany({
      orderBy: { title: 'asc' }
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error("[BREATHING_EXERCISES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
