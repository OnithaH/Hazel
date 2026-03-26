import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile settings
 *     description: Retrieves the current user's settings, including weekly study goal and privacy mode. Automatically creates the user record on first login.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 weekly_study_goal:
 *                   type: integer
 *                 privacy_mode_enabled:
 *                   type: boolean
 *                 bio:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found in Clerk
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Try to find the user in Prisma
    let user = await prisma.user.findUnique({
      where: { clerk_id: userId },
    });

    // If user doesn't exist in Prisma, create them using Clerk data
    if (!user) {
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        return new NextResponse("User not found in Clerk", { status: 404 });
      }

      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

      user = await prisma.user.create({
        data: {
          clerk_id: userId,
          email: email || "",
          name: name || null,
          weekly_study_goal: 15,
          privacy_mode_enabled: false,
        },
      });
    }

    return NextResponse.json({
      weekly_study_goal: user.weekly_study_goal,
      privacy_mode_enabled: user.privacy_mode_enabled,
      bio: user.bio,
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
 *     description: Allows updating the user's weekly study goal, bio or toggling privacy mode.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weekly_study_goal:
 *                 type: integer
 *               privacy_mode_enabled:
 *                 type: boolean
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 clerk_id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 weekly_study_goal:
 *                   type: integer
 *                 privacy_mode_enabled:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 * */
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { weekly_study_goal, privacy_mode_enabled, bio } = body;

    // We use upsert to ensure the user exists before updating
    // If we need to create, we fetch Clerk data
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new NextResponse("User not found in Clerk", { status: 404 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

    const user = await prisma.user.upsert({
      where: { clerk_id: userId },
      update: {
        weekly_study_goal: typeof weekly_study_goal === 'number' ? weekly_study_goal : undefined,
        privacy_mode_enabled: typeof privacy_mode_enabled === 'boolean' ? privacy_mode_enabled : undefined,
        bio: typeof bio === 'string' ? bio : undefined,
      },
      create: {
        clerk_id: userId,
        email: email,
        name: name || null,
        weekly_study_goal: typeof weekly_study_goal === 'number' ? weekly_study_goal : 15,
        privacy_mode_enabled: typeof privacy_mode_enabled === 'boolean' ? privacy_mode_enabled : false,
        bio: typeof bio === 'string' ? bio : null,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PROFILE_PATCH]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error", 
      { status: 500 }
    );
  }
}
