import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * Ensures a User record exists in the database for the given clerkId.
 * TEAM-FRIENDLY: If the user has no robot, it links them to the First Robot in the DB
 * instead of creating a brand new one. This keeps the whole team on ONE robot.
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

    // 3. TEAM FALLBACK: If user has no robots, list them on the First Available Robot
    if (user.robots.length === 0) {
      const firstRobot = await prisma.robot.findFirst();
      
      if (firstRobot) {
        console.log(`[USER_SYNC] Linking user ${user.id} to Master Robot: ${firstRobot.id}`);
        // Link the existing robot to this user
        await prisma.robot.update({
          where: { id: firstRobot.id },
          data: { user_id: user.id }
        });
      } else {
        // Only create a robot if THERE ARE ZERO ROBOTS in the entire database
        console.log(`[USER_SYNC] Create Backup Robot (System was empty)`);
        await prisma.robot.create({
          data: {
            name: "Companion Robot",
            user_id: user.id
          }
        });
      }

      // Refresh user data
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
