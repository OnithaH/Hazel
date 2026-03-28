import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getApiAuth } from '@/lib/api-auth';

/**
 * @swagger
 * /api/environment/current:
 *   get:
 *     summary: Get latest environment data
 *     description: Fetches the latest temperature and humidity readings for a specific robot.
 *     parameters:
 *       - in: query
 *         name: robotId
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the robot.
 *     responses:
 *       200:
 *         description: Latest environment log
 *       400:
 *         description: Missing robotId
 *       404:
 *         description: No logs found
 *       500:
 *         description: Server error
 */
export async function GET(req: Request) {
  try {
    const { user, robot } = await getApiAuth(req);

    if (!user || !robot) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const queryRobotId = searchParams.get('robotId');

    // If a specific robotId is requested, verify if the user has access.
    // Otherwise, use the authenticated robot.id (from getApiAuth).
    const targetRobotId = queryRobotId || robot.id;

    // Fetch the most recent log for this robot
    const latestLog = await prisma.environmentLog.findFirst({
      where: { robot_id: targetRobotId },
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
