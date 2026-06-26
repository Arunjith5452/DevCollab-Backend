import { FeaturedProjectDTO } from "@/application/dtos/project/res/featured-project.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject, injectable } from "inversify";



@injectable()
export class GetFeaturedProjectsUseCase implements IExecute<void, FeaturedProjectDTO[]> {
    constructor(
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>
    ) { }

    async execute(): Promise<FeaturedProjectDTO[]> {

        const projects = await this._projectRepository.findFeatured(
            { status: 'active' },
            { skip: 0, limit: 5 }
        );

        const featuredProjects = projects.map((project: ProjectEntity) => ({
            id: project.id || '',
            title: project.title,
            description: project.description,
            techStack: project.techStack || [],
            creatorName: project.creator?.name || '',
            applicationCount: (project as unknown as { applicationCount?: number }).applicationCount ?? 0,
            status: project.status,
            image: project.image
        }));

        return featuredProjects;
    }
}
