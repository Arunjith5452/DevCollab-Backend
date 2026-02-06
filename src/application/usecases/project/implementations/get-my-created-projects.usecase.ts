import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject, injectable } from "inversify";

@injectable()
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