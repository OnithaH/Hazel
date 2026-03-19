import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/environment/current
 * Description: Fetches the latest temperature and humidity for the dashboard.
 * Query Params: robotId (The UUID of the robot)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const robotId = searchParams.get('robotId');

    if (!robotId) {
      return NextResponse.json({ error: 'Missing robotId parameter' }, { status: 400 });
    }

    // Fetch the most recent log for this robot
    const latestLog = await prisma.environmentLog.findFirst({
      where: { robot_id: robotId },
      orderBy: { recorded_at: 'desc' },
    });

    if (!latestLog) {
      return NextResponse.json({ message: 'No logs found for this robot' }, { status: 404 });
    }

    return NextResponse.json(latestLog);
  } catch (error) {
    console.error('Error fetching current environment data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
