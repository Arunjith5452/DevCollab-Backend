import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { ProjectStatus } from "@/domain/enums/project/project-status.enum";
import { IProjectRepository } from "@/infrastructure/db/repository/interface/project.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject, injectable } from "inversify";


@injectable()
export class DisableProjectUseCase implements IExecute<{ userId: string, projectId: string }, void> {

    constructor(@inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>) { }

    async execute({ userId, projectId }: { userId: string, projectId: string }): Promise<void> {

        try {

            let project = await this._projectRepository.findEntityById(projectId)

            if (!project) {
                throw new Error(ErrorMessage.PROJECT_NOT_FOUND);
            }

            if (project.creatorId !== userId) {
                throw new Error('Only the project creator can disable it');
            }

            if (project.status === ProjectStatus.DISABLED) {
                throw new Error('Project is already disabled');
            }

            project.markAsDisable()

            this._projectRepository.updateEntity(project)


        } catch (error) {
            throw error
        }

    }

}