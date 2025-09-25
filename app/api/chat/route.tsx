import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const pc = new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!, // Removed NEXT_PUBLIC_ for security
});

const index = pc.index("resume-index");

export async function POST(req: Request) {
    try {
        const { query, userId } = await req.json();

        if (!query) {
            return NextResponse.json(
                { success: false, error: "Query is required" },
                { status: 400 }
            );
        }

        // 1️⃣ Generate embedding for the query (using gemini-embedding-001 for 3072 dimensions)
        const embedModel = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });
        const embedResult = await embedModel.embedContent(query);
        const queryEmbedding = embedResult.embedding.values;

        if (!queryEmbedding.length) {
            return NextResponse.json(
                { success: false, error: "Failed to generate embedding" },
                { status: 500 }
            );
        }

        // 2️⃣ Query Pinecone for similar resumes
        const searchResult = await index.namespace(userId || "default-user").query({
            topK: 3,
            vector: Array.from(queryEmbedding),
            includeMetadata: true,
        });

        // 3️⃣ Format context from resume data
        const contexts = searchResult.matches?.map((match) => {
            const metadata = match.metadata || {};
            return `
=== MY RESUME DATA ===
Name: ${metadata.name || "Not provided"}
Role: ${metadata.role || "Not provided"}
Skills: ${metadata.skills || "Not provided"}
Experience: ${metadata.experience || "Not provided"}
Education: ${metadata.education || "Not provided"}
Projects: ${metadata.projects || "Not provided"}
            `.trim();
        });

        const contextString = contexts?.join("\n\n") || "No resume data found.";

        // 4️⃣ Generate answer from Gemini (using newer model)
        const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
        
        const prompt = `You are me, the job applicant, responding to questions about my own resume and background.

MY RESUME INFORMATION:
${contextString}

QUESTION ABOUT MY BACKGROUND: ${query}

RESPONSE GUIDELINES:
- Write in first person as if I'm personally answering ("I have experience in...", "My skills include...", "I worked at...")
- Be confident and professional when talking about my background
- Use natural, conversational language while remaining professional
- Highlight my strengths and experience relevant to the question
- Be specific about my accomplishments and skills
- If the information isn't in my resume, say "That's not reflected in my current resume" or "I haven't included that information"
- Sound like a confident professional discussing their own career

Respond as me, talking about my own background and experience:`;

        const chatResponse = await model.generateContent(prompt);
        const finalText = chatResponse.response.text() || "No response from model.";

        return NextResponse.json({
            success: true,
            result: finalText,
            matchCount: searchResult.matches?.length || 0
        });
    } catch (error) {
        console.error("Chat error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}