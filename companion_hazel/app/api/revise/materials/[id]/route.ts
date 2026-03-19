import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const material = await prisma.revisionMaterial.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!material || material.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized or material not found" }, { status: 404 });
    }

    await prisma.revisionMaterial.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Material deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting material:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
