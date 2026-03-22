import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/study/session/{id}:
 *   patch:
 *     summary: Update an active study session
 *     description: Updates the actual focus time or marks a study session as finished.
 *     tags: [Study]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actual_focus_time:
 *                 type: integer
 *               is_finished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Session updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
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
    const { actual_focus_time, actual_focus_seconds, is_finished } = body;

    // Refine update logic to be more robust and Type-safe
    const updateData: any = {
      end_time: is_finished ? new Date() : undefined,
    };

    if (actual_focus_time !== undefined) {
      updateData.actual_focus_time = typeof actual_focus_time === 'string' ? parseInt(actual_focus_time) : actual_focus_time;
    } else if (actual_focus_seconds !== undefined) {
      // Calculate minutes for the legacy field if only seconds are provided
      const seconds = typeof actual_focus_seconds === 'string' ? parseInt(actual_focus_seconds) : actual_focus_seconds;
      updateData.actual_focus_time = Math.floor(seconds / 60);
    }

    if (actual_focus_seconds !== undefined) {
      updateData.actual_focus_seconds = typeof actual_focus_seconds === 'string' ? parseInt(actual_focus_seconds) : actual_focus_seconds;
    }

    const session = await prisma.studySession.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("[STUDY_SESSION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
