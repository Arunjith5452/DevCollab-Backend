import { PlatformStatsDTO } from "@/application/dtos/platform/platform-stats.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { IUserRepository } from "@/domain/repository/user.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { inject, injectable } from "inversify";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { UserEntity } from "@/domain/entities/user.entity";

@injectable()
export class GetPlatformStatsUseCase implements IExecute<void, PlatformStatsDTO> {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>,
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>
    ) { }

    async execute(): Promise<PlatformStatsDTO> {

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const [allUsers, allProjects] = await Promise.all([
            this._userRepository.findAll(),
            this._projectRepository.findAll()
        ]);

        const totalUsers = allUsers.length;
        const totalProjects = allProjects.length;
        const activeProjects = allProjects.filter(p => p.status === 'active').length;

        const usersThisWeek = 0;

        const projectsThisWeek = allProjects.filter(p =>
            p.createdAt && new Date(p.createdAt) >= oneWeekAgo
        ).length;

        const averageRating = 4.9;

        return {
            totalUsers,
            totalProjects,
            activeProjects,
            averageRating,
            usersThisWeek,
            projectsThisWeek
        };
    }
}
