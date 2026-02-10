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

        const projects = await this._projectRepository.findAll();


        const featuredProjects = projects
            .filter((p: ProjectEntity) => p.status === 'active')
            .slice(0, 5)
            .map((project: ProjectEntity) => ({
                id: project.id || '',
                title: project.title,
                description: project.description,
                techStack: project.techStack || [],
                creatorName: 'Unknown',
                applicationCount: 0,
                status: project.status,
                image: project.image
            }));

        return featuredProjects;
    }
}
