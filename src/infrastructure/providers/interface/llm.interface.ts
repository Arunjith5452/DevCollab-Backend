import { RequiredRole } from "@/domain/types/required-role.type";

export interface ILLMService {
    analyzeCandidateCompatibility(
        project: { title: string; techStack: string[]; description: string; requiredRoles: RequiredRole[] },
        candidates: { id: string; name: string; skills?: string[]; bio?: string; role: string }[]
    ): Promise<{ suggestions: { id: string; score: number; reason: string }[] }>;
}
