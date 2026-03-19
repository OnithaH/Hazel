import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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
