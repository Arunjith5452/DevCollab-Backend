import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { IProjectRepository } from "@/infrastructure/db/repository/interface/project.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject } from "inversify";


export class GetMyCreatedProjectUseCase implements IExecute<{ userId: string }, ProjectEntity[]> {

    constructor(@inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>
    ) { }


    async execute({ userId }: { userId: string }): Promise<ProjectEntity[]> {
        try {

            let project = await this._projectRepository.findByCreatorId(userId)

            return project

        } catch (error) {
            throw error
        }
    }

}