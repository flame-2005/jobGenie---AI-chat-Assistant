import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from '@google/genai';
import { EducationEntry, ExperienceEntry, FormData, ProjectEntry } from "@/constants/resumeForm"
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const pc = new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!, 
});

const index = pc.index("resume-index");

// Convert resume object into a single string
function serializeResume(resume: FormData) {
    return `
Name: ${resume.name || ""}
Email: ${resume.email || ""}
Role: ${resume.role || ""}
Skills: ${Array.isArray(resume.skills)
            ? resume.skills.join(", ")
            : (resume.skills || "").split(",").map((s) => s.trim()).join(", ")
        }
Experience: ${(resume.experience || [])
            .map(
                (exp) =>
                    `${exp.title || ""} at ${exp.company || ""} (${exp.startDate || ""} - ${exp.endDate || ""
                    }): ${exp.description || ""}`
            )
            .join("\n") || ""
        }
Education: ${(resume.education || [])
            .map(
                (edu) =>
                    `${edu.degree || ""} at ${edu.institution || ""} (${edu.startDate || ""} - ${edu.endDate || ""
                    })` // ✅ Fixed: Consistent property names
            )
            .join("\n") || ""
        }
Projects: ${(resume.projects || [])
            .map((p) => `${p.name || ""}: ${p.description || ""}`)
            .join("\n") || ""
        }
`;
}

export async function POST(req: Request) {
    try {
        const resume = await req.json();
        const userId = resume.userId || "default-user";

        const textToEmbed = serializeResume(resume);

        // ✅ Enhanced error handling for Gemini API
        const embeddingResponse = await genAI.models.embedContent({
            model: "gemini-embedding-001", // ✅ Updated to correct model name
            contents: {
                parts: [{ text: textToEmbed }]
            }
        });
        
        // ✅ Properly extract embedding values as number array
        let embedding: number[] = [];
        
        // Extract from embeddings array (correct property name)
        if (embeddingResponse.embeddings?.[0]?.values) {
            const values = embeddingResponse.embeddings[0].values;
            embedding = Array.isArray(values) ? values : Array.from(values);
        }
        
        console.log('Embedding length:', embedding.length); // ✅ Debug log

        if (!embedding.length) {
            return NextResponse.json({ 
                success: false, 
                error: "Failed to generate embedding" 
            }, { status: 500 });
        }

        await index.namespace(userId).upsert([
            {
                id: resume.id || `resume-${Date.now()}`,
                values: embedding,
                metadata: {
                    name: resume.name || "",
                    role: resume.role || "",
                    skills: Array.isArray(resume.skills)
                        ? resume.skills.join(", ")
                        : typeof resume.skills === "string"
                            ? resume.skills
                            : "",
                    experience: (resume.experience || [])
                        .map(
                            (exp: ExperienceEntry) =>
                                `${exp.title} at ${exp.company} (${exp.startDate}-${exp.endDate}): ${exp.description}`
                        )
                        .join(" | "),
                    education: (resume.education || [])
                        .map(
                            (edu: EducationEntry) =>
                                `${edu.degree} from ${edu.institution} (${edu.startDate}-${edu.endDate})` // ✅ Fixed: Consistent properties
                        )
                        .join(" | "),
                    projects: (resume.projects || [])
                        .map(
                            (proj: ProjectEntry) =>
                                `${proj.name}: ${proj.description}`
                        )
                        .join(" | ") // ✅ Added: Projects metadata for better searchability
                }
            },
        ]);

        return NextResponse.json({ success: true, message: "Embedding stored!" });
    } catch (error) {
        console.error("Embedding error:", error);
        
        // ✅ Enhanced error handling
        if (error instanceof Error) {
            // Handle specific API errors
            if (error.message.includes('API key')) {
                return NextResponse.json({ 
                    success: false, 
                    error: "API authentication failed" 
                }, { status: 401 });
            }
            return NextResponse.json({ 
                success: false, 
                error: error.message 
            }, { status: 500 });
        }
        
        return NextResponse.json({ 
            success: false, 
            error: "Unknown error occurred" 
        }, { status: 500 });
    }
}