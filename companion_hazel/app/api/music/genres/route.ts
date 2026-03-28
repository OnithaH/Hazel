import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getApiAuth } from "@/lib/api-auth";

/**
 * @swagger
 * /api/music/genres:
 *   get:
 *     summary: Get all music genre configurations
 *     description: Returns a list of music genre mapping configurations to link genres with specific aroma chambers/scents.
 *     tags: [Music]
 *     responses:
 *       200:
 *         description: Music genre mappings successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mappings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       robot_id: { type: string }
 *                       genre_name: { type: string }
 *                       scent_name: { type: string }
 *                       theme_color_hex: { type: string }
 *       500:
 *         description: Internal server error.
 */
export async function GET(req: Request) {
  try {
    const { user, robot } = await getApiAuth(req);

    if (!user || !robot) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const mappings = await prisma.musicGenreMapping.findMany({
      where: { robot_id: robot.id }
    });
    
    return NextResponse.json({ mappings });
  } catch (error) {
    console.error("Genres API Error:", error);
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 });
  }
}
