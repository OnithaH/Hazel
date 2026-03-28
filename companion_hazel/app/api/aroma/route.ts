import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiAuth } from "@/lib/api-auth";

/**
 * @swagger
 * /api/aroma:
 *   get:
 *     summary: Get aroma configurations
 *     description: Returns a list of active aroma configurations for the robot. Supports both Clerk User and Robot Secret.
 *     tags: [Aroma]
 *     parameters:
 *       - in: header
 *         name: x-robot-secret
 *         schema:
 *           type: string
 *         description: Optional robot secret key for hardware access.
 *     responses:
 *       200:
 *         description: Aroma configurations retrieved successfully
 *       401:
 *         description: Unauthorized (Invalid Clerk session or Robot Secret)
 *       404:
 *         description: Robot not found for this user
 *       500:
 *         description: Internal server error
 */
export async function GET(req: Request) {
  try {
    // 1. Unified Auth: Detect if this is a Human or a Robot
    const { robot } = await getApiAuth(req);

    if (!robot) {
      return new NextResponse("Unauthorized: Invalid session or robot secret", { status: 401 });
    }

    // 2. Fetch configurations for the identified robot
    const aromaConfigs = await prisma.aromaConfiguration.findMany({
      where: {
        robot_id: robot.id,
      },
      orderBy: {
        chamber_number: 'asc',
      },
    });

    return NextResponse.json(aromaConfigs);
  } catch (error) {
    console.error("[AROMA_LIST_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

/**
 * @swagger
 * /api/aroma:
 *   post:
 *     summary: Create aroma configuration
 *     tags: [Aroma]
 */
export async function POST(req: Request) {
  try {
    const { robot } = await getApiAuth(req);

    if (!robot) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { chamber_number, scent_name, intensity, color_hex } = body;

    if (!scent_name) {
      return new NextResponse("Missing scent_name", { status: 400 });
    }

    const aroma = await prisma.aromaConfiguration.create({
      data: {
        robot_id: robot.id,
        chamber_number: chamber_number || 1,
        scent_name,
        intensity: intensity || 50,
        color_hex: color_hex || "#AD46FF",
        isActive: false,
      },
    });

    return NextResponse.json(aroma, { status: 201 });
  } catch (error) {
    console.error("[AROMA_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
