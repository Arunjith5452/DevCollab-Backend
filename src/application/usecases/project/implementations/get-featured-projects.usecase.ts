import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject, injectable } from "inversify";

export interface FeaturedProjectDTO {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    creatorName: string;
    applicationCount: number;
    status: string;
    image?: string;
}

@injectable()
export class GetFeaturedProjectsUseCase implements IExecute<void, FeaturedProjectDTO[]> {
    constructor(
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>
    ) { }

    async execute(): Promise<FeaturedProjectDTO[]> {
        // Get all projects
        const projects = await this._projectRepository.findAll();

        // Take first 5 active projects (TODO: implement proper featured logic with applicationCount)
        const featuredProjects = projects
            .filter((p: ProjectEntity) => p.status === 'active')
            .slice(0, 5)
            .map((project: ProjectEntity) => ({
                id: project.id || '',
                title: project.title,
                description: project.description,
                techStack: project.techStack || [],
                creatorName: 'Unknown', // Creator info not available in findAll
                applicationCount: 0, // TODO: Add applicationCount to ProjectEntity
                status: project.status,
                image: project.image
            }));

        return featuredProjects;
    }
}
