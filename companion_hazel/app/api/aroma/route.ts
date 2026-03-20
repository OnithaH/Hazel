import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/aroma:
 *   get:
 *     summary: Get aroma configurations
 *     description: Returns a list of active aroma configurations for the user's robot. Can optionally specify robotId.
 *     tags: [Aroma]
 *     parameters:
 *       - in: query
 *         name: robotId
 *         schema:
 *           type: string
 *         description: Optional robot ID to fetch configurations for.
 *     responses:
 *       200:
 *         description: Aroma configurations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   robot_id: { type: string }
 *                   chamber_number: { type: integer }
 *                   scent_name: { type: string }
 *                   intensity: { type: integer }
 *                   color_hex: { type: string }
 *                   isActive: { type: boolean }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Robot or user not found
 *       500:
 *         description: Internal server error
 */
export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let robotId = searchParams.get('robotId');

    // If robotId is not provided, try to find it via the current user
    if (!robotId) {
      const user = await prisma.user.findUnique({
        where: { clerk_id: userId },
        include: { robots: true },
      });

      if (!user || user.robots.length === 0) {
        return new NextResponse("Robot not found", { status: 404 });
      }

      robotId = user.robots[0].id;
    }

    const aromaConfigs = await prisma.aromaConfiguration.findMany({
      where: {
        robot_id: robotId,
      },
      orderBy: {
        chamber_number: 'asc',
      },
    });

    return NextResponse.json(aromaConfigs);
  } catch (error) {
    console.error("[AROMA_LIST_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
