import { ProjectResponseDTO } from "@/application/dtos/project/res/project-response.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { SuccessMessage } from "@/domain/enums/messages/success-message.enum";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { ProjectPresentationMapper } from "@/infrastructure/mappers/project-presentation.mapper";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject, injectable } from "inversify";

@injectable()
export class ProjectDetailsUseCase implements IExecute<string, { project: ProjectResponseDTO, message: string }> {
    constructor(
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
        @inject(ProjectPresentationMapper) private readonly _projectMapper: ProjectPresentationMapper
    ) { }

    async execute(projectId: string): Promise<{ project: ProjectResponseDTO; message: string }> {
        try {
            const project = await this._projectRepository.findByIdWithCreator(projectId);
            if (!project) {
                throw new Error("Project not found");
            }

            return {
                project: this._projectMapper.toResponseDTO(project),
                message: SuccessMessage.PROJECT_FETCHED
            };
        } catch (error) {
            throw error;
        }
    }
}