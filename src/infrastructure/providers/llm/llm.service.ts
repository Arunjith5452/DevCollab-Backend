
import { injectable } from "inversify";
import { ILLMService } from "../interface/llm.interface";
import { RequiredRole } from "@/domain/types/required-role.type";
import { OpenRouterResponse } from "../interface/openrouter-response.interface";

@injectable()
export class LLMService implements ILLMService {
    async analyzeCandidateCompatibility(
        project: { title: string; techStack: string[]; description: string; requiredRoles: RequiredRole[] },
        candidates: { id: string; name: string; skills?: string[]; bio?: string; role: string }[]
    ): Promise<{ suggestions: { id: string; score: number; reason: string }[] }> {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-lite-preview-02-05:free",
                    messages: [
                        {
                            role: "system",
                            content: `You are an AI recruitment expert. Analyze the compatibility between the project and the candidates.
                            Return a JSON object with a "suggestions" array.
                            Each suggestion should have:
                            - id: string (candidate id)
                            - score: number (0-100)
                            - reason: string (brief explanation)
                            
                            Output JSON ONLY.`
                        },
                        {
                            role: "user",
                            content: JSON.stringify({ project, candidates })
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`LLM API Error: ${response.statusText}`);
            }

            const data = await response.json() as OpenRouterResponse;
            const content = data.choices[0].message.content;

            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
            const jsonString = jsonMatch ? jsonMatch[1] : content;

            return JSON.parse(jsonString);

        } catch (error) {
            console.error("LLM Error:", error);
            return { suggestions: [] };
        }
    }
}
