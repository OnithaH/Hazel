import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getApiAuth } from "@/lib/api-auth";

export async function POST(req: Request) {
  try {
    const { user, robot } = await getApiAuth(req);

    if (!user || !robot) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { message } = await req.json();
    if (!message) return new NextResponse("Missing message", { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "GEMINI_API_KEY") {
      return NextResponse.json({ 
        message: "Hazel's AI brain is not yet connected. Please add your Gemini API key to the .env file.", 
        timestamp: new Date().toISOString() 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using gemini-1.5-flash for reliability
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const robotId = robot.id;

    let envContext = "Sensor data unavailable.";
    if (robotId) {
      const latestEnv = await prisma.environmentLog.findFirst({
        where: { robot_id: robotId },
        orderBy: { recorded_at: 'desc' }
      });
      if (latestEnv) {
        envContext = `Temperature: ${latestEnv.temperature}°C, Humidity: ${latestEnv.humidity}%`;
      }
    }

    // 2. Generation
    const systemPrompt = `You are Hazel, the "Hazel Companion" AI for a smart robotics system.
Your persona: Friendly, professional, and helpful. You are integrated into a system that monitors environment (temp, humidity) and manages aromas.

REAL-TIME CONTEXT:
${envContext}

INSTRUCTIONS:
- IDENTIFY YOURSELF as Hazel or the Hazel Companion.
- ONLY mention sensor data (Temperature, Humidity) if the user EXPLICITLY asks about the environment or if it's highly relevant. DO NOT report stats in every message.
- Keep responses concise and focused on the user's needs.`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: message }
    ]);
    
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      message: text, 
      timestamp: new Date().toISOString() 
    });

  } catch (error: any) {
    console.error("[HAZEL_CHAT_FATAL_ERROR]", error);
    // Return the actual error message if it's a quota issue to help the user
    const errorMsg = error.message?.includes("quota") ? "AI Quota exceeded. Please try again in 1 minute." : "Internal Error in Hazel Chat";
    return new NextResponse(errorMsg, { status: 500 });
  }
}
