import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/user/stats/mode-usage:
 *   get:
 *     summary: Get weekly mode usage statistics
 *     description: Provides a detailed breakdown of time spent in each mode (Study, Game, Music, General) over the last 7 days.
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Mode usage statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totals:
 *                   type: object
 *                   properties:
 *                     study: { type: string }
 *                     gaming: { type: string }
 *                     music: { type: string }
 *                     general: { type: string }
 *                 weeklyAnalysis:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day: { type: string }
 *                       segments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             label: { type: string }
 *                             value: { type: integer }
 *                             color: { type: string }
 *                       total: { type: string }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Robot or user not found
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: userId },
      include: {
        robots: true,
      },
    });

    if (!user || user.robots.length === 0) {
      return new NextResponse("Robot not found", { status: 404 });
    }

    const robotId = user.robots[0].id;

    // Get logs for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await prisma.modeUsageLog.findMany({
      where: {
        robot_id: robotId,
        start_time: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: {
        start_time: 'asc',
      },
    });

    // Helper to calculate duration in seconds
    const getDurationSeconds = (start: Date, end: Date | null) => {
      const endTime = end || new Date();
      return Math.floor((endTime.getTime() - start.getTime()) / 1000);
    };

    // Aggregate totals by mode
    const totals: Record<string, number> = {
      STUDY: 0,
      GAME: 0,
      MUSIC: 0,
      GENERAL: 0,
    };

    // Daily breakdown for the chart (in minutes for the chart)
    const daily: Record<string, Record<string, number>> = {};
    let isInProgress = false;

    // Initialize the last 7 days
    const last7Days: string[] = [];
    const now = new Date();
    const todayName = now.toLocaleDateString('en-US', { weekday: 'short' });

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        last7Days.push(dayName);
        daily[dayName] = { STUDY: 0, GAME: 0, MUSIC: 0, GENERAL: 0, total: 0 };
    }

    let todaySeconds = 0;
    const todayModes: Record<string, number> = { STUDY: 0, GAME: 0, MUSIC: 0, GENERAL: 0 };

    logs.forEach((log: any) => {
      const seconds = getDurationSeconds(log.start_time, log.end_time);
      const day = log.start_time.toLocaleDateString('en-US', { weekday: 'short' });
      
      if (!log.end_time) isInProgress = true;

      // Determine base mode
      let mode = 'GENERAL';
      const upperMode = log.mode.toUpperCase();
      if (upperMode.includes('STUDY')) mode = 'STUDY';
      else if (upperMode.includes('GAME')) mode = 'GAME';
      else if (upperMode.includes('MUSIC')) mode = 'MUSIC';

      totals[mode] += seconds;

      if (daily[day]) {
        daily[day][mode] += Math.floor(seconds / 60);
        daily[day].total += Math.floor(seconds / 60);
      }

      if (day === todayName) {
        todaySeconds += seconds;
        todayModes[mode] += seconds;
      }
    });

    // Format output for the dashboard
    const weeklyAnalysis = last7Days.map((day) => {
      const total = daily[day].total;
      return {
        day,
        segments: [
          { label: 'Study', value: daily[day].STUDY, color: 'bg-blue-500', w: total > 0 ? (daily[day].STUDY / total) * 100 : 0 },
          { label: 'Gaming', value: daily[day].GAME, color: 'bg-purple-500', w: total > 0 ? (daily[day].GAME / total) * 100 : 0 },
          { label: 'Music', value: daily[day].MUSIC, color: 'bg-pink-500', w: total > 0 ? (daily[day].MUSIC / total) * 100 : 0 },
          { label: 'General', value: daily[day].GENERAL, color: 'bg-green-500', w: total > 0 ? (daily[day].GENERAL / total) * 100 : 0 },
        ],
        total: `${Math.floor(total / 60)}h ${total % 60}m`,
      };
    });

    // Today's detailed segments
    const todaySegments = [
        { label: 'Study', percent: todaySeconds > 0 ? Math.round((todayModes.STUDY / todaySeconds) * 100) : 0, colorClass: 'bg-blue-500', width: todaySeconds > 0 ? `${Math.round((todayModes.STUDY / todaySeconds) * 100)}%` : '0%' },
        { label: 'Gaming', percent: todaySeconds > 0 ? Math.round((todayModes.GAME / todaySeconds) * 100) : 0, colorClass: 'bg-purple-500', width: todaySeconds > 0 ? `${Math.round((todayModes.GAME / todaySeconds) * 100)}%` : '0%' },
        { label: 'Music', percent: todaySeconds > 0 ? Math.round((todayModes.MUSIC / todaySeconds) * 100) : 0, colorClass: 'bg-pink-500', width: todaySeconds > 0 ? `${Math.round((todayModes.MUSIC / todaySeconds) * 100)}%` : '0%' },
        { label: 'General', percent: todaySeconds > 0 ? Math.round((todayModes.GENERAL / todaySeconds) * 100) : 0, colorClass: 'bg-green-500', width: todaySeconds > 0 ? `${Math.round((todayModes.GENERAL / todaySeconds) * 100)}%` : '0%' },
    ];

    return NextResponse.json({
      today: {
        totalSeconds: todaySeconds,
        segments: todaySegments,
        isInProgress
      },
      totals: {
        study: `${Math.floor(totals.STUDY / 3600)}h ${Math.floor((totals.STUDY % 3600) / 60)}m`,
        gaming: `${Math.floor(totals.GAME / 3600)}h ${Math.floor((totals.GAME % 3600) / 60)}m`,
        music: `${Math.floor(totals.MUSIC / 3600)}h ${Math.floor((totals.MUSIC % 3600) / 60)}m`,
        general: `${Math.floor(totals.GENERAL / 3600)}h ${Math.floor((totals.GENERAL % 3600) / 60)}m`,
      },
      weeklyAnalysis,
    });
  } catch (error) {
    console.error("[MODE_USAGE_STATS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
