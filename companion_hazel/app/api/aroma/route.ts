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
    const secret = req.headers.get('x-robot-secret');

    let robotId: string | null = null;

    if (secret) {
      const robot = await prisma.robot.findUnique({
        where: { secret_key: secret },
      });
      if (robot) robotId = robot.id;
    } else if (userId) {
      const user = await prisma.user.findUnique({
        where: { clerk_id: userId },
        include: { robots: true },
      });
      if (user && user.robots.length > 0) {
        robotId = user.robots[0].id;
      }
    }

    if (!robotId) {
      return new NextResponse("Unauthorized or Robot Not Found", { status: 401 });
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
