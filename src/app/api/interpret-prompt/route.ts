// src/app/api/interpret-prompt/route.ts
import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: "api key",
});

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { data, prompt } = body;
  
      console.log("Received data:", data);
      console.log("Received prompt:", prompt);
  
      const systemMessage = `
  You are a data cleaning assistant. 
  You receive an array of arrays representing tabular data.
  Follow the user's instruction and return the updated table (headers + rows).
  Only output the array of arrays.
  `;
  
      const userMessage = `
  Data:
  ${JSON.stringify(data)}
  
  Instruction:
  ${prompt}
  `;
  
      const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo", // ✅ switched from "gpt-4" to this
  messages: [
    { role: "system", content: systemMessage },
    { role: "user", content: userMessage },
  ],
  temperature: 0.2,
      });
  
      const content = completion.choices[0].message.content;
  
      console.log("OpenAI Response:", content);
  
      if (!content) {
        return NextResponse.json(
          { error: "No content received from OpenAI" },
          { status: 500 }
        );
      }
  
      const updatedData = JSON.parse(content);
      return NextResponse.json({ updatedData });
  
    } catch (error) {
      console.error("Error occurred:", error);
      return NextResponse.json(
        { error: "Failed to process request or parse OpenAI response" },
        { status: 500 }
      );
    }
  }
  