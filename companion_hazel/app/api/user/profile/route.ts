import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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
    });
  } catch (error) {
    console.error("[USER_PROFILE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { weekly_study_goal, privacy_mode_enabled } = body;

    const user = await prisma.user.update({
      where: { clerk_id: userId },
      data: {
        weekly_study_goal: typeof weekly_study_goal === 'number' ? weekly_study_goal : undefined,
        privacy_mode_enabled: typeof privacy_mode_enabled === 'boolean' ? privacy_mode_enabled : undefined,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PROFILE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
