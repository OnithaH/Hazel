import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. Find the user by clerk_id
    let user = await prisma.user.findUnique({
      where: { clerk_id: userId },
      include: {
        robots: true,
      },
    });

    // 2. If user doesn't exist, create them (or return 404)
    if (!user) {
      // Create user if they don't exist in our DB but exist in Clerk
      user = await prisma.user.create({
        data: {
          clerk_id: userId,
          email: `${userId}@example.com`, // Placeholder email
          name: "User",
        },
        include: { robots: true }
      });
    }

    // 3. If user exists but has no robots, assign the first available robot
    if (user.robots.length === 0) {
      const allRobots = await prisma.robot.findMany();
      if (allRobots.length > 0) {
        // Link the first robot to this user
        const robot = await prisma.robot.update({
          where: { id: allRobots[0].id },
          data: { user_id: user.id }
        });
        return NextResponse.json(robot);
      } else {
        return new NextResponse("No robots available in system", { status: 404 });
      }
    }

    return NextResponse.json(user.robots[0]);
  } catch (error) {
    console.error("[USER_ROBOT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
