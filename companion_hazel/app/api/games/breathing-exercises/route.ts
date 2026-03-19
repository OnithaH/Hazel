import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const exercises = await prisma.breathingExercise.findMany({
      orderBy: { title: 'asc' }
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error("[BREATHING_EXERCISES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
