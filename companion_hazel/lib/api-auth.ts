import { auth } from "@clerk/nextjs/server";
import prisma from "./prisma";
import { ensureUserAndRobot } from "./userSync";

export interface ApiAuthResponse {
  user: any | null;
  robot: any | null;
  isRobot: boolean;
}

/**
 * Helper to authenticate either a Clerk User or a Robot with a Secret Key.
 * Used by all team members to make their APIs "Robot-Friendly."
 */
export async function getApiAuth(req: Request): Promise<ApiAuthResponse> {
  // 1. Check for Clerk User (Browser/Web side)
  const { userId } = await auth();
  
  // 2. Check for Robot Secret (Hardware/Pi side)
  const secret = req.headers.get("x-robot-secret");

  let user = null;
  let robot = null;
  let isRobot = false;

  // --- ROBOT PATH ---
  if (secret) {
    robot = await prisma.robot.findUnique({
      where: { secret_key: secret },
      include: { user: true },
    });
    
    if (robot) {
      user = robot.user;
      isRobot = true;
      return { user, robot, isRobot };
    }
  }

  // --- USER PATH ---
  if (userId) {
    // ACTIVE SYNC: Ensure this user exists and is linked to the shared robot
    user = await ensureUserAndRobot(userId);

    // TEAM FALLBACK: If this user has no robots, let them "share" the first one in the DB.
    // This allows all 5 team members to see the same physical robot instantly.
    if (user && (!user.robots || user.robots.length === 0)) {
      const firstRobot = await prisma.robot.findFirst({
        include: { user: true },
      });
      if (firstRobot) {
        robot = firstRobot;
      }
    } else if (user && user.robots.length > 0) {
      robot = user.robots[0];
    }
  }

  return { user, robot, isRobot };
}
