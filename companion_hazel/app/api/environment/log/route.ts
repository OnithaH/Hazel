import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/environment/log
 * Description: Logs temperature and humidity from the Raspberry Pi / ESP32.
 * Headers: X-Robot-Secret (The unique secret for the robot)
 */
export async function POST(req: Request) {
  try {
    // 1. Extract the secret from headers
    const secret = req.headers.get('x-robot-secret');

    if (!secret) {
      return NextResponse.json({ error: 'Missing robot secret' }, { status: 401 });
    }

    // 2. Identify the robot in the database
    const robot = await prisma.robot.findUnique({
      where: { secret_key: secret },
    });

    if (!robot) {
      return NextResponse.json({ error: 'Invalid robot secret' }, { status: 403 });
    }

    // 3. Extract sensor data from the body
    const body = await req.json();
    const { temperature, humidity } = body;

    if (temperature === undefined || humidity === undefined) {
      return NextResponse.json({ error: 'Missing temperature or humidity' }, { status: 400 });
    }

    // 4. Create the environment log record
    const log = await prisma.environmentLog.create({
      data: {
        robot_id: robot.id,
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
      },
    });

    return NextResponse.json({ message: 'Log created successfully', data: log }, { status: 201 });
  } catch (error) {
    console.error('Error logging environment data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
