import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiAuth } from "@/lib/api-auth";
import { ensureUserAndRobot } from "@/lib/userSync";

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile settings (Team-Friendly)
 *     description: Retrieves the current user's settings. Automatically creates the user record and links them to the Hazel Master robot on first login.
 *     tags: [User]
 */
export async function GET(req: Request) {
  try {
    const { user: authUser, robot } = await getApiAuth(req);

    if (!authUser || !robot) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = authUser.clerk_id;

    // 1. Unified Sync: Ensure the user exists and is linked to the robot
    const user = await ensureUserAndRobot(userId);

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({
      weekly_study_goal: user.weekly_study_goal,
      privacy_mode_enabled: user.privacy_mode_enabled,
      bio: user.bio,
      robots: user.robots
    });
  } catch (error) {
    console.error("[USER_PROFILE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

/**
 * @swagger
 * /api/user/profile:
 *   patch:
 *     summary: Update user profile settings
 *     tags: [User]
 */
export async function PATCH(req: Request) {
  try {
    const { user: authUser, robot } = await getApiAuth(req);

    if (!authUser || !robot) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = authUser.clerk_id;

    const body = await req.json();
    const { weekly_study_goal, privacy_mode_enabled, bio } = body;

    const user = await prisma.user.update({
      where: { clerk_id: userId },
      data: {
        weekly_study_goal: typeof weekly_study_goal === 'number' ? weekly_study_goal : undefined,
        privacy_mode_enabled: typeof privacy_mode_enabled === 'boolean' ? privacy_mode_enabled : undefined,
        bio: typeof bio === 'string' ? bio : undefined,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PROFILE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
