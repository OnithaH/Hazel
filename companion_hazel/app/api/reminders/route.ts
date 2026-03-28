import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const robotId = searchParams.get("robotId");

    if (!robotId) return new NextResponse("Missing robotId", { status: 400 });

    const reminders = await prisma.reminder.findMany({
      where: { robot_id: robotId },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error("[REMINDERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { robotId, title, date, time, type } = body;

    if (!robotId || !title || !date) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const reminder = await prisma.reminder.create({
      data: {
        robot_id: robotId,
        title,
        date: new Date(date),
        time,
        type: type || "Task",
      },
    });

    return NextResponse.json(reminder, { status: 201 });
  } catch (error) {
    console.error("[REMINDERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
