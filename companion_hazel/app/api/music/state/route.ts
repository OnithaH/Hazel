import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

declare global {
  var musicState: any;
}

// Simple in-memory state manager to bridge the Dashboard and the Raspberry Pi.
// In production with multiple robots, this should be tracked in a database or Redis.
global.musicState = global.musicState || {
  nowPlaying: null,
  queue: [],
  command: null, // "play", "pause", "skip_next", "skip_previous"
  aromaChamber: null,
  genre: null,
};

/**
 * @swagger
 * /api/music/state:
 *   get:
 *     summary: Get current music state
 *     description: Returns the in-memory music state including what is currently playing, the queue, and any pending commands.
 *     tags: [Music]
 *     responses:
 *       200:
 *         description: Music state successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nowPlaying:
 *                   type: object
 *                   nullable: true
 *                 queue:
 *                   type: array
 *                   items:
 *                     type: object
 *                 command:
 *                   type: string
 *                   nullable: true
 *                 aromaChamber:
 *                   type: string
 *                   nullable: true
 *                 genre:
 *                   type: string
 *                   nullable: true
 */
export async function GET() {
  return NextResponse.json(global.musicState);
}

/**
 * @swagger
 * /api/music/state:
 *   post:
 *     summary: Update music state or send a command
 *     description: Used by the Dashboard to send commands or enqueue songs, and by the Raspberry Pi to sync its playback status.
 *     tags: [Music]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nowPlaying:
 *                 type: object
 *                 description: Set by the Raspberry Pi to indicate the currently playing song.
 *               command:
 *                 type: string
 *                 description: Command for the Raspberry Pi (e.g., 'play', 'pause', 'next', 'enqueue_song').
 *               song:
 *                 type: object
 *                 description: Song object to be enqueued.
 *               queue:
 *                 type: array
 *                 description: Allows overwriting the current queue state.
 *               clearCommand:
 *                 type: boolean
 *                 description: Set to true by the Raspberry Pi to acknowledge receipt of a command.
 *     responses:
 *       200:
 *         description: State successfully updated.
 *       400:
 *         description: Invalid payload submitted.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // The Dashboard or Pi can update the state
    if (body.nowPlaying !== undefined) {
      const isNewSong = global.musicState.nowPlaying?.title !== body.nowPlaying?.title;
      global.musicState.nowPlaying = body.nowPlaying;

      if (isNewSong && body.nowPlaying?.title && process.env.GEMINI_API_KEY) {
        // Use Gemini to detect genre automatically!
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const prompt = `Classify this song into exactly ONE of these genres: Pop, Ballet, Rock, Jazz, Classical. If it doesn't fit perfectly, pick the closest one. Reply with ONLY the genre word. Song: "${body.nowPlaying.title}" by "${body.nowPlaying.artist}"`;
          const result = await model.generateContent(prompt);
          const genreText = result.response.text().trim();

          const validGenres = ["Pop", "Ballet", "Rock", "Jazz", "Classical"];
          const matchedGenre = validGenres.find(g => genreText.includes(g)) || "Pop";
          global.musicState.genre = matchedGenre;

          // Find the aroma mapping from DB
          const mapping = await prisma.musicGenreMapping.findFirst({
            where: { genre_name: matchedGenre }
          });
          global.musicState.aromaChamber = mapping?.scent_name || "Citrus";
        } catch (e) {
          console.error("Gemini genre detection failed", e);
        }
      }
    }

    if (body.command !== undefined) {
      global.musicState.command = body.command;
      if (body.song !== undefined) global.musicState.song = body.song;
    }
    if (body.queue !== undefined) global.musicState.queue = body.queue;
    if (body.aromaChamber !== undefined) global.musicState.aromaChamber = body.aromaChamber;
    if (body.genre !== undefined) global.musicState.genre = body.genre;

    // Acknowledge command receipt and clear it if the Pi is polling and reading it
    if (body.clearCommand) {
      global.musicState.command = null;
      global.musicState.song = null;
    }

    return NextResponse.json(global.musicState);
  } catch (error) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

