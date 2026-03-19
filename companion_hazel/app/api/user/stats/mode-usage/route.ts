import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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

    // Helper to calculate duration in minutes
    const getDuration = (start: Date, end: Date | null) => {
      const endTime = end || new Date();
      return Math.floor((endTime.getTime() - start.getTime()) / (1000 * 60));
    };

    // Aggregate totals by mode
    const totals: Record<string, number> = {
      STUDY: 0,
      GAME: 0,
      MUSIC: 0,
      GENERAL: 0,
    };

    // Daily breakdown for the chart
    const daily: Record<string, Record<string, number>> = {};

    // Initialize the last 7 days in the daily map to ensure even empty days are present
    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        last7Days.push(dayName);
        daily[dayName] = { STUDY: 0, GAME: 0, MUSIC: 0, GENERAL: 0, total: 0 };
    }

    logs.forEach((log: any) => {
      const duration = getDuration(log.start_time, log.end_time);
      const day = log.start_time.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Determine base mode
      let mode = 'GENERAL';
      const upperMode = log.mode.toUpperCase();
      if (upperMode.includes('STUDY')) mode = 'STUDY';
      else if (upperMode.includes('GAME')) mode = 'GAME';
      else if (upperMode.includes('MUSIC')) mode = 'MUSIC';

      totals[mode] += duration;

      if (daily[day]) {
        daily[day][mode] += duration;
        daily[day].total += duration;
      }
    });

    // Format output for the dashboard (Dynamic order of days)
    const weeklyAnalysis = last7Days.map((day) => ({
      day,
      segments: [
        { label: 'Study', value: daily[day].STUDY, color: 'bg-blue-500' },
        { label: 'Gaming', value: daily[day].GAME, color: 'bg-purple-500' },
        { label: 'Music', value: daily[day].MUSIC, color: 'bg-pink-500' },
        { label: 'General', value: daily[day].GENERAL, color: 'bg-green-500' },
      ],
      total: `${Math.floor(daily[day].total / 60)}h ${daily[day].total % 60}m`,
    }));

    return NextResponse.json({
      totals: {
        study: `${Math.floor(totals.STUDY / 60)}h ${totals.STUDY % 60}m`,
        gaming: `${Math.floor(totals.GAME / 60)}h ${totals.GAME % 60}m`,
        music: `${Math.floor(totals.MUSIC / 60)}h ${totals.MUSIC % 60}m`,
        general: `${Math.floor(totals.GENERAL / 60)}h ${totals.GENERAL % 60}m`,
      },
      weeklyAnalysis,
    });
  } catch (error) {
    console.error("[MODE_USAGE_STATS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
