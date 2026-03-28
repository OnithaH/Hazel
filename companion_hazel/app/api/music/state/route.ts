import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * @swagger
 * /api/music/state:
 *   get:
 *     summary: Get current music state
 *     description: Returns the music state from the database including what is currently playing, the queue, and any pending commands.
 *     tags: [Music]
 */
export async function GET() {
  try {
    const robot = await prisma.robot.findFirst({
      include: { musicState: true }
    });
    if (!robot) return NextResponse.json({ error: "No robot found in database. Create a robot first." }, { status: 404 });

    let state = robot.musicState;
    if (!state) {
      state = await prisma.musicState.create({
        data: {
          robot_id: robot.id,
          queue: []
        }
      });
    }

    return NextResponse.json({
      nowPlaying: state.nowPlaying,
      queue: state.queue,
      command: state.command,
      aromaChamber: state.aromaChamber,
      genre: state.genre,
      song: state.song
    });
  } catch (error) {
    console.error("GET /api/music/state Error:", error);
    return NextResponse.json({ error: "Failed to fetch state" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/music/state:
 *   post:
 *     summary: Update music state or send a command
 *     description: Used by the Dashboard to send commands or enqueue songs, and by the Raspberry Pi to sync its playback status.
 *     tags: [Music]
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const robot = await prisma.robot.findFirst({ include: { musicState: true } });
    if (!robot) return NextResponse.json({ error: "No robot found" }, { status: 404 });

    let state = robot.musicState;
    if (!state) {
      state = await prisma.musicState.create({
        data: { robot_id: robot.id, queue: [] }
      });
    }

    const updates: any = {};

    // Handle enqueue_song internally so the queue is immediately updated in the DB
    if (body.command === "enqueue_song" && body.song) {
      const currentQueue = Array.isArray(state.queue) ? state.queue : [];
      updates.queue = [...currentQueue, body.song];
    } else if (body.command !== undefined) {
      updates.command = body.command;
      if (body.song !== undefined) updates.song = body.song;
    }

    // Process currently playing update from the Pi
    if (body.nowPlaying !== undefined) {
      const isNewSong = (state.nowPlaying as any)?.title !== body.nowPlaying?.title;
      updates.nowPlaying = body.nowPlaying;

      if (isNewSong && body.nowPlaying?.title && process.env.GEMINI_API_KEY) {
        // Use Gemini to detect genre automatically
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const prompt = `Classify this song into exactly ONE of these genres: Pop, Ballet, Rock, Jazz, Classical. If it doesn't fit perfectly, pick the closest one. Reply with ONLY the genre word. Song: "${body.nowPlaying.title}" by "${body.nowPlaying.artist || 'Unknown'}"`;
          const result = await model.generateContent(prompt);
          const genreText = result.response.text().trim();

          const validGenres = ["Pop", "Ballet", "Rock", "Jazz", "Classical"];
          const matchedGenre = validGenres.find(g => genreText.includes(g)) || "Pop";
          updates.genre = matchedGenre;

          // Find the aroma mapping from DB
          const mapping = await prisma.musicGenreMapping.findFirst({
            where: { genre_name: matchedGenre, robot_id: robot.id }
          });
          updates.aromaChamber = mapping?.scent_name || "Citrus";
        } catch (e) {
          console.error("Gemini genre detection failed", e);
        }
      }
    }

    // Allow Pi or Dashboard to override the queue if they explicitly send it
    if (body.queue !== undefined && body.command !== "enqueue_song") {
      updates.queue = body.queue;
    }
    
    if (body.aromaChamber !== undefined) updates.aromaChamber = body.aromaChamber;
    if (body.genre !== undefined) updates.genre = body.genre;

    // Acknowledge command receipt
    if (body.clearCommand) {
      updates.command = null;
      updates.song = null;
    }

    const updatedState = await prisma.musicState.update({
      where: { id: state.id },
      data: updates
    });

    return NextResponse.json(updatedState);
  } catch (error) {
    console.error("POST /api/music/state Error:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
