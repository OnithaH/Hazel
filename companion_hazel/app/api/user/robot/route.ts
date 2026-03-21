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
/**
 * @swagger
 * /api/user/robot:
 *   post:
 *     summary: Create a robot for the user
 *     description: Creates a new robot assigned to the currently authenticated user. If the user doesn't exist in the database, they are created first.
 *     tags: [Robot]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 default: "Companion Robot"
 *     responses:
 *       201:
 *         description: Robot created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { name } = body;

    // 1. Ensure user exists
    let user = await prisma.user.findUnique({
      where: { clerk_id: userId },
    });

    if (!user) {
      // If user doesn't exist, we need to try and get their data from Clerk or just create them with placeholders
      // For simplicity and since they are authenticated, we create them.
      // Ideally we'd use clerkUser data but for a quick fix, this works as they'll likely update it later.
      user = await prisma.user.create({
        data: {
          clerk_id: userId,
          email: `${userId}@clerk.user`, // Temporary email if not found
          name: "User",
        },
      });
    }

    // 2. Check if robot already exists
    const existingRobot = await prisma.robot.findFirst({
      where: { user_id: user.id }
    });

    if (existingRobot) {
      return NextResponse.json(existingRobot, { status: 200 }); // Return existing instead of erroring
    }

    // 3. Create robot
    const robot = await prisma.robot.create({
      data: {
        name: name || "Companion Robot",
        user_id: user.id,
      },
    });

    return NextResponse.json(robot, { status: 201 });
  } catch (error) {
    console.error("[USER_ROBOT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
