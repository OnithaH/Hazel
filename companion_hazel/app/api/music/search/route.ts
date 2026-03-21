import { NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

const ytmusic = new YTMusic();
let initialized = false;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "No query provided" }, { status: 400 });
  }

  try {
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
