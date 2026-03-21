import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateQuestions = async (fileContent: string | Buffer, mimeType: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze the following study material. 
    1. Extract the main educational content and provide a comprehensive summary/transcription of the key facts and concepts (at least 500 words if possible, or the full text if shorter).
    2. Generate 10 questions and answers to help a student revise based on this content.
    Each question should also have a brief explanation for the correct answer.
    
    Return the response ONLY as a JSON object with the following structure:
    {
      "sourceText": "...",
      "questions": [
        {
          "question": "...",
          "answer": "...",
          "explanation": "..."
        }
      ]
    }
  `;

  let result;
  if (typeof fileContent === "string") {
    result = await model.generateContent([prompt, fileContent]);
  } else {
    result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: fileContent.toString("base64"),
          mimeType,
        },
      },
    ]);
  }

  const response = await result.response;
  const text = response.text();
  
  // Extract JSON from text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse response from AI");
  }

  return JSON.parse(jsonMatch[0]);
};
