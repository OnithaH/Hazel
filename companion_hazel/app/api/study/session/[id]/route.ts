import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { actual_focus_time, is_finished } = body;

    const session = await prisma.studySession.update({
      where: { id },
      data: {
        actual_focus_time: actual_focus_time !== undefined ? parseInt(actual_focus_time) : undefined,
        end_time: is_finished ? new Date() : undefined,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("[STUDY_SESSION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
