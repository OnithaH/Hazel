import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/revise/materials:
 *   get:
 *     summary: Fetch all revision materials for the user
 *     description: Returns a list of all study materials uploaded by the authenticated user, including the question count.
 *     responses:
 *       200:
 *         description: List of revision materials.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const materials = await prisma.revisionMaterial.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        uploaded_at: "desc",
      },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    return NextResponse.json(materials);
  } catch (error: any) {
    console.error("Error in materials API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
