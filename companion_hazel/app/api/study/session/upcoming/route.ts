import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const robotId = searchParams.get("robotId");

    if (!robotId) return new NextResponse("Missing robotId", { status: 400 });

    // Fetch sessions that haven't ended yet and are in the future
    const upcomingSessions = await prisma.studySession.findMany({
      where: {
        robot_id: robotId,
        end_time: null,
        start_time: {
          gt: new Date(),
        },
      },
      orderBy: {
        start_time: 'asc',
      },
    });

    return NextResponse.json(upcomingSessions);
  } catch (error) {
    console.error("[STUDY_SESSION_UPCOMING_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
