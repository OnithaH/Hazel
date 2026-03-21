import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // In a production system, fetch the mapping for the active robot_id.
    const mappings = await prisma.musicGenreMapping.findMany();
    return NextResponse.json({ mappings });
  } catch (error) {
    console.error("Genres API Error:", error);
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 });
  }
}
