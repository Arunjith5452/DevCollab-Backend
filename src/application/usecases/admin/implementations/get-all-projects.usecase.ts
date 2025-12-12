import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { IProjectRepository } from "@/infrastructure/db/repository/interface/project.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject } from "inversify";
import { GetAllProjectsQuery } from "../interface/projects-usecase.interface";
import { SuccessMessage } from "@/domain/enums/messages/success-message.enum";


export class GetAllProjectsUseCase implements IExecute<GetAllProjectsQuery, { message: string, projects: ProjectEntity[], total: number }> {

    constructor(
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>
    ) { }

    async execute(query: GetAllProjectsQuery): Promise<{ message: string; projects: ProjectEntity[]; total: number; }> {

        try {

            const { search, status, difficulty, page = 1, limit = 3 } = query

            const filter: Record<string, unknown> = {}

            if (search) filter.$or = { title: { $regex: search, $otions: 'i' } }
            if (status && status !== 'all') filter.status = status
            if (difficulty && difficulty !== 'all') filter.difficulty = difficulty

            const skip = (page - 1) * limit

            const [projects, count] = await Promise.all([this._projectRepository.find(filter, { skip, limit }), this._projectRepository.count(filter)])

            let total = Math.ceil(count / limit)

            return {
                message: SuccessMessage.PROJECT_FETCHED,
                projects,
                total
            }

        } catch (error) {
            throw error
        }

    }

}