import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiAuth } from "@/lib/api-auth";

export async function GET(req: Request) {
  try {
    const { user, robot } = await getApiAuth(req);
    if (!user || !robot) return new NextResponse("Unauthorized", { status: 401 });

    const robotId = robot.id;

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
    const { user, robot } = await getApiAuth(req);
    if (!user || !robot) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { title, date, time, type } = body;

    if (!title || !date) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const { robotId: bodyRobotId } = body;
    const robotId = bodyRobotId || robot.id;

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
