import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiAuth } from "@/lib/api-auth";

/**
 * @swagger
 * /api/user/robot:
 *   get:
 *     summary: Get user's assigned robot (Team-Friendly)
 *     description: Retrieves the robot. If the user has no robot, it automatically "Adopts" the first one in the DB for the team.
 *     tags: [Robot]
 */
export async function GET(req: Request) {
  try {
    // 1. Unified Auth: Detect the User/Robot
    const { user, robot } = await getApiAuth(req);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!robot) {
      return new NextResponse("No robots available in system", { status: 404 });
    }

    // 2. Return the robot (either owned or "Adopted" via Team Fallback in getApiAuth)
    return NextResponse.json(robot);
  } catch (error) {
    console.error("[USER_ROBOT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

/**
 * @swagger
 * /api/user/robot:
 *   post:
 *     summary: Create a robot for the user (Ensures User exists)
 *     tags: [Robot]
 */
export async function POST(req: Request) {
  try {
    const { user: apiUser } = await getApiAuth(req);

    if (!apiUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { name } = body;

    // Check if robot already exists for this specific user
    const existingRobot = await prisma.robot.findFirst({
      where: { user_id: apiUser.id }
    });

    if (existingRobot) {
      return NextResponse.json(existingRobot, { status: 200 });
    }

    // Create a new robot for this user
    const robot = await prisma.robot.create({
      data: {
        name: name || "Companion Robot",
        user_id: apiUser.id,
      },
    });

    return NextResponse.json(robot, { status: 201 });
  } catch (error) {
    console.error("[USER_ROBOT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
