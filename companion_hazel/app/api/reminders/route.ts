import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getGoogleAuthClient, createGoogleCalendarEvent, updateGoogleCalendarEvent, deleteGoogleCalendarEvent } from '@/lib/googleCalendar';

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
 * Description: Creates a new reminder and syncs with Google Calendar.
 * Body: { robotId, title, date, time, type }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { robotId, title, date, time, type } = body;

    if (!robotId || !title || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch user for Google Refresh Token
    const robot = await prisma.robot.findUnique({
      where: { id: robotId },
      include: { user: true },
    });

    let googleEventId = null;
    const refreshToken = robot?.user?.google_refresh_token;

    // 2. Sync with Google Calendar if token exists
    if (refreshToken) {
      const auth = await getGoogleAuthClient(refreshToken);
      googleEventId = await createGoogleCalendarEvent(auth, { title, date: new Date(date), time });
    }

    // 3. Create reminder in database
    const newReminder = await prisma.reminder.create({
      data: {
        robot_id: robotId,
        title: title,
        date: new Date(date),
        time: time,
        type: type || 'Task',
        google_event_id: googleEventId,
      },
    });

    return NextResponse.json({ message: 'Reminder created', data: newReminder }, { status: 201 });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/reminders?id=uuid
 * Description: Updates a reminder and syncs with Google Calendar.
 */
export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = await req.json();
    const { title, date, time, type } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing reminder ID' }, { status: 400 });
    }

    const existingReminder = await prisma.reminder.findUnique({
      where: { id },
      include: { robot: { include: { user: true } } },
    });

    if (!existingReminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    const updatedData: any = {
      title: title ?? existingReminder.title,
      date: date ? new Date(date) : existingReminder.date,
      time: time ?? existingReminder.time,
      type: type ?? existingReminder.type,
    };

    // Sync with Google Calendar
    const refreshToken = existingReminder.robot.user.google_refresh_token;
    if (refreshToken && existingReminder.google_event_id) {
      const auth = await getGoogleAuthClient(refreshToken);
      await updateGoogleCalendarEvent(auth, existingReminder.google_event_id, {
        title: updatedData.title,
        date: updatedData.date,
        time: updatedData.time,
      });
    } else if (refreshToken && !existingReminder.google_event_id) {
      // If we didn't have an event before but now we have a token, create it
      const auth = await getGoogleAuthClient(refreshToken);
      updatedData.google_event_id = await createGoogleCalendarEvent(auth, updatedData);
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(updatedReminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/reminders?id=uuid
 * Description: Deletes a reminder and removes from Google Calendar.
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing reminder ID' }, { status: 400 });
    }

    const existingReminder = await prisma.reminder.findUnique({
      where: { id },
      include: { robot: { include: { user: true } } },
    });

    if (!existingReminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    // Sync deletion with Google Calendar
    const refreshToken = existingReminder.robot.user.google_refresh_token;
    if (refreshToken && existingReminder.google_event_id) {
      const auth = await getGoogleAuthClient(refreshToken);
      await deleteGoogleCalendarEvent(auth, existingReminder.google_event_id);
    }

    await prisma.reminder.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Reminder deleted' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
