import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { SuccessMessage } from "@/domain/enums/messages/success-message.enum";
import { IProjectRepository } from "@/infrastructure/db/repository/interface/project.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject, injectable } from "inversify";
import { GetAllProjectsQuery } from "../interface/project-listing.usecase.interface";


@injectable()
export class ListProjectUseCase implements IExecute<GetAllProjectsQuery, { mesage: string, projects: ProjectEntity[], total: number }> {
    constructor(@inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>) { }

    async execute(query: GetAllProjectsQuery): Promise<{ mesage: string; projects: ProjectEntity[]; total: number }> {

        try {

            const { search, techStack, roleNeeded, difficulty, page = 1, limit = 3 } = query

            const filter: Record<string, unknown> = {
                status: { $ne: "disabled" }
            };


            if (search) {
                filter.title = { $regex: search, $options: "i" }
            }

            if (techStack) {
                filter.techStack = { $in: [techStack] };
            }
            if (difficulty) {
                filter.difficulty = difficulty;
            }

            if (roleNeeded) {
                filter["requiredRoles.role"] = {
                    $regex: `^${roleNeeded}$`,
                    $options: "i"
                }
            }

            const skip = (page - 1) * limit

            const [projects, count] = await Promise.all([this._projectRepository.find(filter, { skip, limit }), this._projectRepository.count(filter)])

            let total = Math.ceil(count / limit)

            return {
                total,
                mesage: SuccessMessage.PROJECT_FETCHED,
                projects,
            };

        } catch (error) {

            throw error

        }

    }
}