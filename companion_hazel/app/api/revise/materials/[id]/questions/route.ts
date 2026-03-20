import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
  { params }: { params: { id: string } }
) {
  try {
    const questions = await prisma.revisionQuestion.findMany({
      where: {
        material_id: params.id,
      },
    });

    return NextResponse.json(questions);
  } catch (error: any) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
