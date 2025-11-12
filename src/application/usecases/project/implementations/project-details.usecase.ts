import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { SuccessMessage } from "@/domain/enums/messages/success-message.enum";
import { IProjectRepository } from "@/infrastructure/db/repository/interface/project.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject } from "inversify";




export class ProjectDetailsUseCase implements IExecute<string, { project: ProjectEntity, message: string }> {
    constructor(@inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>) { }

    async execute(projectId: string): Promise<{ project: ProjectEntity; message: string }> {

        try {

            let project = await this._projectRepository.findByIdWithCreator(projectId)
            if (!project) {
                throw new Error("Project not found");
            }

            return {
                project,
                message: SuccessMessage.PROJECT_FETCHED
            }



        } catch (error) {

            throw error

        }

    }
}