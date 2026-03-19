import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { generateQuestions } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;

    // 1. Generate questions using Gemini
    const aiResponse = await generateQuestions(buffer, mimeType);
    const { sourceText, questions } = aiResponse;

    // 2. Save material metadata to DB
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    const material = await prisma.revisionMaterial.create({
      data: {
        user_id: userId,
        file_name: file.name,
        file_url: "",
        content: sourceText,
        expires_at: expiresAt,
        questions: {
          create: questions.map((q: any) => ({
            question: q.question,
            answer: q.answer,
            explanation: q.explanation || "",
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json({
      message: "Material uploaded and questions generated successfully",
      material,
    });
  } catch (error: any) {
    console.error("Error in upload API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
