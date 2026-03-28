import { NextResponse } from "next/server";
import { getApiAuth } from "@/lib/api-auth";
import YTMusic from "ytmusic-api";

const ytmusic = new YTMusic();
let initialized = false;

/**
 * @swagger
 * /api/music/search:
 *   get:
 *     summary: Search for songs on YouTube Music
 *     description: Returns a list of YouTube Music songs matching the query term.
 *     tags: [Music]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query string (e.g., song title, artist name).
 *     responses:
 *       200:
 *         description: A list of search results successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       videoId: { type: string }
 *                       name: { type: string }
 *                       artist: 
 *                         type: object
 *                         properties:
 *                           name: { type: string }
 *                       thumbnails:
 *                         type: array
 *                         items: 
 *                           type: object
 *                           properties:
 *                             url: { type: string }
 *       400:
 *         description: Bad request, missing query parameter 'q'.
 *       500:
 *         description: Internal server error from ytmusic-api.
 */
export async function GET(req: Request) {
  try {
    const { user, robot } = await getApiAuth(req);

    if (!user || !robot) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 });
    }

    if (!initialized) {
      await ytmusic.initialize();
      initialized = true;
    }
    
    // Search for songs specifically
    const results = await ytmusic.searchSongs(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("YTMusic Search Error:", error);
    return NextResponse.json({ error: "Failed to search YTMusic" }, { status: 500 });
  }
}
