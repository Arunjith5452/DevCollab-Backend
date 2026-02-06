import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject } from "inversify";




export class GetProjectForEditUseCase implements IExecute<{ userId: string, projectId: string }, ProjectEntity> {

    constructor(@inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
    ) { }

    async execute({ userId, projectId }: { userId: string, projectId: string }): Promise<ProjectEntity> {
        try {


            const project = await this._projectRepository.findById(projectId);
            if (!project) throw new Error(ErrorMessage.PROJECT_NOT_FOUND);


            if (project.creatorId.toString() !== userId) {
                throw new Error("You are not allowed to edit this project.")
            }

            return project

        } catch (error) {
            throw error
        }
    }


}