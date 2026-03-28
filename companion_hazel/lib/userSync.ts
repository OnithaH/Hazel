import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * Ensures a User record exists in the database for the given clerkId.
 * If not, it creates one using Clerk data.
 * Also ensures the user has at least one companion Robot assigned.
 */
export async function ensureUserAndRobot(clerkId: string) {
  try {
    // 1. Find the user with their robots
    let user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
      include: { robots: true },
    });

    // 2. If user doesn't exist, create them
    if (!user) {
      const clerkUser = await currentUser();
      
      const email = clerkUser?.emailAddresses[0]?.emailAddress || `${clerkId}@example.com`;
      const name = clerkUser ? `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() : "Study User";

      console.log(`[USER_SYNC] Creating user for clerkId: ${clerkId}`);
      user = await prisma.user.create({
        data: {
          clerk_id: clerkId,
          email: email,
          name: name || "Study User",
          weekly_study_goal: 15,
        },
        include: { robots: true }
      });
    }

    // 3. If user has no robots, create a new companion robot for them
    if (user.robots.length === 0) {
      console.log(`[USER_SYNC] Creating new companion robot for user: ${user.id}`);
      await prisma.robot.create({
        data: {
          name: "Companion Robot",
          user_id: user.id
        }
      });

      // Refresh user data to include the new robot
      user = await prisma.user.findUnique({
        where: { id: user.id },
        include: { robots: true },
      }) || user;
    }

    return user;
  } catch (error) {
    console.error("[USER_SYNC] Error during synchronization:", error);
    throw error;
  }
}
