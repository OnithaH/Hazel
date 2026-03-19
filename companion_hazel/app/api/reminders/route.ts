import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/reminders?robotId=uuid
 * Description: Fetches all upcoming reminders for a specific robot.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const robotId = searchParams.get('robotId');

    if (!robotId) {
      return NextResponse.json({ error: 'Missing robotId parameter' }, { status: 400 });
    }

    const reminders = await prisma.reminder.findMany({
      where: { robot_id: robotId },
      orderBy: { date: 'asc' }, // Sort by date
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/reminders
 * Description: Creates a new reminder.
 * Body: { robotId, title, date, time, type }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { robotId, title, date, time, type } = body;

    if (!robotId || !title || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newReminder = await prisma.reminder.create({
      data: {
        robot_id: robotId,
        title: title,
        date: new Date(date), // Expecting ISO string or YYYY-MM-DD
        time: time,
        type: type || 'Task',
      },
    });

    return NextResponse.json({ message: 'Reminder created', data: newReminder }, { status: 201 });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
