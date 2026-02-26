import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject, injectable } from "inversify";

@injectable()
export class GetMyCreatedProjectUseCase implements IExecute<{ userId: string, page?: number, limit?: number }, { projects: ProjectEntity[], total: number }> {

    constructor(@inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>
    ) { }


    async execute({ userId, page = 1, limit = 10 }: { userId: string, page?: number, limit?: number }): Promise<{ projects: ProjectEntity[], total: number }> {
        try {

            const skip = (page - 1) * limit;
            const result = await this._projectRepository.findByCreatorId(userId, { skip, limit });

            return result;

        } catch (error) {
            throw error
        }
    }

}