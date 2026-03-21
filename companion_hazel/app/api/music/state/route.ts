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

export async function GET() {
  return NextResponse.json(global.musicState);
}

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

