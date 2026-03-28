import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiAuth } from "@/lib/api-auth";

/**
 * @swagger
 * /api/revise/materials/{id}/questions:
 *   get:
 *     summary: Fetch questions for a specific material
 *     description: Returns all AI-generated questions and answers for a given revision material ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the revision material.
 *     responses:
 *       200:
 *         description: List of revision questions and answers.
 *       500:
 *         description: Server error.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, robot } = await getApiAuth(req);
    if (!user || !robot) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const material = await prisma.revisionMaterial.findUnique({
      where: { id: id },
    });

    if (!material || material.user_id !== user.clerk_id) {
      return NextResponse.json({ error: "Unauthorized or material not found" }, { status: 404 });
    }

    const questions = await prisma.revisionQuestion.findMany({
      where: {
        material_id: id,
      },
    });

    return NextResponse.json(questions);
  } catch (error: any) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
