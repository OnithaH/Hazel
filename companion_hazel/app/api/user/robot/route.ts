import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/user/robot:
 *   get:
 *     summary: Get user's assigned robot
 *     description: Retrieves details of the robot assigned to the currently authenticated user.
 *     tags: [Robot]
 *     responses:
 *       200:
 *         description: Robot details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 secret_key:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or robot not found
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: userId },
      include: {
        robots: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (user.robots.length === 0) {
      return new NextResponse("No robot found for this user", { status: 404 });
    }

    // Returning the first robot as per the "One robot is assigned to one user" rule
    return NextResponse.json(user.robots[0]);
  } catch (error) {
    console.error("[USER_ROBOT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
