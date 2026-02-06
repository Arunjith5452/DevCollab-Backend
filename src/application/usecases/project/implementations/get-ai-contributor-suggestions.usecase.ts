
import { inject, injectable } from "inversify";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { IApplicationRepository } from "@/domain/repository/application.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { ApplicationEntity } from "@/domain/entities/application.entity";
import { createHash } from "crypto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { AiSuggestionResult, PopulatedUser } from "../interface/ai-contributor-suggestions.usecase.interface";
import { ILLMService } from "@/infrastructure/providers/interface/llm.interface";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { ICacheService } from "@/application/interface/cache.service.interface";



@injectable()
export class GetAiContributorSuggestionsUseCase implements IExecute<string, AiSuggestionResult> {
    constructor(
        @inject(PROJECT_TYPES.ProjectRepository) private _projectRepository: IProjectRepository<ProjectEntity>,
        @inject(PROJECT_TYPES.ApplicationRepository) private _applicationRepository: IApplicationRepository<ApplicationEntity>,
        @inject(PROJECT_TYPES.LLMService) private _llmService: ILLMService,
        @inject(COMMON_TYPES.CacheService) private _cacheService: ICacheService
    ) { }
    async execute(projectId: string): Promise<AiSuggestionResult> {
        // 1. Fetch Project
        const project = await this._projectRepository.findEntityById(projectId);
        if (!project) throw new Error("Project not found");

        // 2. Fetch Pending Applications
        const applications = await this._applicationRepository.getPendingByProject(projectId);
        if (!applications || applications.length === 0) {
            return { suggestions: [], source: 'heuristic' };
        }

        // 3. Heuristic Fallback (< 3 Applicants)
        if (applications.length < 3) {
            return {
                suggestions: this.runHeuristicAnalysis(project, applications),
                source: 'heuristic'
            };
        }

        // 4. Optimization: Check Cache
        const applicantsHash = this.generateHash(applications);
        const cacheKey = `ai_suggestions:${projectId}:${applicantsHash}`;

        const cachedResult = await this._cacheService.get(cacheKey);
        if (cachedResult) {
            return {
                suggestions: JSON.parse(cachedResult),
                source: 'ai'
            };
        }

        // 5. Call LLM
        // Map applications to 'UserEntity' like structure for LLM
        const candidates = applications.map(app => {
            // Runtime check because repository returns populated object despite entity definition
            const user = app.userId as unknown as PopulatedUser;
            return {
                id: app.id!, // Application ID to map back easily
                role: "Applicant", // Application doesn't have role, using generic
                skills: app.techStack || [],
                name: user?.name || "Unknown Candidate",
                bio: user?.bio || ""
            };
        });

        const aiResult = await this._llmService.analyzeCandidateCompatibility(
            {
                title: project.title,
                description: project.description,
                techStack: project.techStack,
                requiredRoles: project.requiredRoles || []
            },
            candidates
        );

        // 6. Cache and Return
        // Sort by score
        const sortedSuggestions = aiResult.suggestions.sort((a, b) => b.score - a.score);

        // Slice Top 3
        const top3 = sortedSuggestions.slice(0, 3);

        await this._cacheService.set(cacheKey, JSON.stringify(top3), "EX", 3600 * 24); // Cache for 24h

        return {
            suggestions: top3,
            source: 'ai'
        };
    }

    private generateHash(applications: ApplicationEntity[]): string {
        const ids = applications.map(a => a.id).sort().join(",");
        return createHash('md5').update(ids).digest('hex');
    }

    private runHeuristicAnalysis(project: ProjectEntity, applications: ApplicationEntity[]) {
        return applications.map(app => {
            const projectStack = project.techStack || [];
            const appStack = app.techStack || [];

            // Calculate intersection
            const matches = appStack.filter((skill: string) =>
                projectStack.some((pSkill: string) => pSkill.toLowerCase() === skill.toLowerCase())
            );

            const matchCount = matches.length;
            const total = projectStack.length || 1;
            const score = Math.round((matchCount / total) * 100);

            return {
                id: app.id!,
                score: Math.min(score + 10, 100), // slight boost for being human
                reason: matches.length > 0
                    ? `Matches ${matches.length} required skills: ${matches.join(", ")}`
                    : "Partial skill match based on profile."
            };
        }).sort((a, b) => b.score - a.score);
    }
}
