import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject, injectable } from "inversify";
import { GetProjectMembersQuery } from "../interface/team-members-listing.usecase.interface";
import { GetProjectMembersResult } from "@/application/dtos/project/res/get-team-members.dto";


@injectable()
export class GetProjectMembersUseCase implements IExecute<{ projectId: string }, GetProjectMembersResult> {

    constructor(@inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>) { }

    async execute(query: GetProjectMembersQuery): Promise<GetProjectMembersResult> {

        try {

            const { projectId, limit = 10, page = 1, search = '' } = query

            const project = await this._projectRepository.findByIdWithPopulation(projectId)

            if (!project || !project.members) {
                return { users: [], currentPage: page, totalPages: 0, totalItems: 0 };
            }

            let members = project.members;

            if (search.trim()) {
                const regex = new RegExp(search.trim(), "i");
                members = members.filter((m) =>
                    m.user && (regex.test(m.user.name) || regex.test(m.user.email))
                );
            }

            const totalItems = members.length;
            const start = (page - 1) * limit;
            const paginated = members.slice(start, start + limit);

            const users = paginated.map((m) => ({
                id: m.userId,
                name: m.user?.name ?? "Unknown User",
                email: m.user?.email ?? "N/A",
                role: m.role as "contributor" | "maintainer",
                joinedAt: m.joinedAt,
            }));

            return {
                users,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit) || 1,
                totalItems,
            };

        } catch (error) {
            throw error
        }

    }

}