import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/revise/materials/{id}:
 *   delete:
 *     summary: Delete a revision material
 *     description: Permanently deletes a revision material and all its associated questions for the authenticated user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the revision material to delete.
 *     responses:
 *       200:
 *         description: Material deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Material not found.
 *       500:
 *         description: Server error.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const material = await prisma.revisionMaterial.findUnique({
      where: {
        id: id,
      },
    });

    if (!material || material.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized or material not found" }, { status: 404 });
    }

    await prisma.revisionMaterial.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Material deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting material:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
