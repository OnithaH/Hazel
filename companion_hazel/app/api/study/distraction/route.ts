import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * POST /api/study/distraction
 * Description: Logs interference (phone or drowsiness) detected by the Raspberry Pi.
 * Body: { session_id, type }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session_id, type } = body;

    if (!session_id || !type) {
      return new NextResponse("Session ID and type are required", { status: 400 });
    }

    // Verify session exists
    const session = await prisma.studySession.findUnique({
      where: { id: session_id },
    });

    if (!session) {
      return new NextResponse("Session not found", { status: 404 });
    }

    const distraction = await prisma.distractionLog.create({
      data: {
        session_id,
        type, // 'PHONE' or 'DROWSINESS'
      },
    });

    return NextResponse.json({ message: 'Distraction logged', data: distraction });
  } catch (error) {
    console.error("[STUDY_DISTRACTION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
