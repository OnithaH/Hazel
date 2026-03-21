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

    // Sync name from Clerk if it's missing or set to the placeholder "User"
    if (!user || user.name === "User" || !user.name) {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

        if (!user) {
          // Create if absolutely not found (backup)
          user = await prisma.user.create({
            data: {
              clerk_id: userId,
              email: email || "",
              name: name || null,
              weekly_study_goal: 15,
              privacy_mode_enabled: false,
            },
          });
        } else if ((name && user.name !== name) || (email && user.email !== email)) {
          // Update if name or email exists in Clerk and is different from DB
          user = await prisma.user.update({
            where: { clerk_id: userId },
            data: { 
              name: name || user.name,
              email: email || user.email
            }
          });
        }
      }
    }

    if (!user) {
      return new NextResponse("User profile could not be initialized", { status: 500 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email?.endsWith('@clerk.user') ? null : user.email,
      weekly_study_goal: user.weekly_study_goal,
      privacy_mode_enabled: user.privacy_mode_enabled,
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
 *     description: Allows updating the user's weekly study goal or toggling privacy mode.
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
 *                 weekly_study_goal:
 *                   type: integer
 *                 privacy_mode_enabled:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { weekly_study_goal, privacy_mode_enabled, email, name } = body;

    const user = await prisma.user.update({
      where: { clerk_id: userId },
      data: {
        weekly_study_goal: typeof weekly_study_goal === 'number' ? weekly_study_goal : undefined,
        privacy_mode_enabled: typeof privacy_mode_enabled === 'boolean' ? privacy_mode_enabled : undefined,
        email: typeof email === 'string' ? email : undefined,
        name: typeof name === 'string' ? name : undefined,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PROFILE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
