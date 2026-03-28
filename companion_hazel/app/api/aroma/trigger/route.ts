import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiAuth } from "@/lib/api-auth";

/**
 * @swagger
 * /api/aroma/trigger:
 *   post:
 *     summary: Trigger a specific aroma chamber
 *     description: Signals the robot to release scent from a specified chamber or by scent name.
 *     tags: [Aroma]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chamber_number:
 *                 type: integer
 *               scent_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Aroma trigger signaled successfully
 *       400:
 *         description: chamber_number or scent_name is required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Aroma configuration not found or Robot not found
 *       500:
 *         description: Internal server error
 */
export async function POST(req: Request) {
  try {
    const { user, robot } = await getApiAuth(req);

    if (!user || !robot) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { chamber_number, scent_name } = await req.json();

    if (chamber_number === undefined && !scent_name) {
      return new NextResponse("chamber_number or scent_name is required", { status: 400 });
    }

    const robotId = robot.id;

    // Verify the configuration exists
    const config = await prisma.aromaConfiguration.findFirst({
      where: {
        robot_id: robotId,
        OR: [
          { chamber_number: chamber_number !== undefined ? parseInt(chamber_number) : undefined },
          { scent_name: scent_name || undefined },
        ],
      },
    });

    if (!config) {
      return new NextResponse("Aroma configuration not found", { status: 404 });
    }

    // In a real scenario, this might send a signal to a MQTT broker or a socket.
    // For now, we return the configuration to be consumed by the robot.
    return NextResponse.json({
      message: "Aroma trigger signaled",
      action: "RELEASE_SCENT",
      config: {
        chamber: config.chamber_number,
        scent: config.scent_name,
        intensity: config.intensity,
      }
    });
  } catch (error) {
    console.error("[AROMA_TRIGGER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
