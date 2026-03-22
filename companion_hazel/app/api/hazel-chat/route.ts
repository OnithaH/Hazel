import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

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
    
    // Using gemini-2.5-flash which was verified to work with this key
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 1. Context
    const user = await prisma.user.findUnique({
      where: { clerk_id: userId },
      include: { robots: true }
    });

    let robotId = user?.robots[0]?.id;
    if (user && !robotId) {
       const allRobots = await prisma.robot.findMany();
       if (allRobots.length > 0) {
         await prisma.robot.update({
           where: { id: allRobots[0].id },
           data: { user_id: user.id }
         });
         robotId = allRobots[0].id;
       }
    }

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
