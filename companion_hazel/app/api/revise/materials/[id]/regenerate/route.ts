import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { generateQuestions } from "@/lib/gemini";

/**
 * @swagger
 * /api/revise/materials/{id}/regenerate:
 *   post:
 *     summary: Re-generate questions for a material
 *     description: Generates a new set of 10 questions using the stored source content for the given material ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the revision material.
 *     responses:
 *       200:
 *         description: Questions re-generated successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Material not found.
 *       500:
 *         description: Server error.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const materialId = id;

    const material = await prisma.revisionMaterial.findUnique({
      where: { id: materialId },
    });

    if (!material || material.user_id !== userId) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    if (!material.content) {
      return NextResponse.json({ error: "No source content available for re-generation. Please re-upload the file." }, { status: 400 });
    }

    // 1. Generate new questions using the stored content
    const aiResponse = await generateQuestions(material.content, "text/plain");
    const { questions } = aiResponse;

    // 2. Delete old questions and save new ones in a transaction
    await prisma.$transaction([
      prisma.revisionQuestion.deleteMany({
        where: { material_id: materialId },
      }),
      prisma.revisionQuestion.createMany({
        data: questions.map((q: any) => ({
          material_id: materialId,
          question: q.question,
          answer: q.answer,
          explanation: q.explanation || "",
        })),
      }),
    ]);

    const updatedMaterial = await prisma.revisionMaterial.findUnique({
      where: { id: materialId },
      include: { 
        questions: true,
        _count: {
          select: { questions: true }
        }
      },
    });

    return NextResponse.json({
      message: "Questions re-generated successfully",
      material: updatedMaterial,
    });
  } catch (error: any) {
    console.error("Error in regenerate API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
