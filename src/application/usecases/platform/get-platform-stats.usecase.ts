import { PlatformStatsDTO } from "@/application/dtos/platform/platform-stats.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { IProjectRepository } from "@/infrastructure/db/repository/interface/project.interface";
import { IUserRepository } from "@/infrastructure/db/repository/interface/user.interface";
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
        // Calculate date for "this week" (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Get all users and projects
        const [allUsers, allProjects] = await Promise.all([
            this._userRepository.findAll(),
            this._projectRepository.findAll()
        ]);

        // Calculate statistics
        const totalUsers = allUsers.length;
        const totalProjects = allProjects.length;
        const activeProjects = allProjects.filter(p => p.status === 'active').length;

        // Calculate users added this week (UserEntity doesn't have createdAt, so return 0 for now)
        const usersThisWeek = 0; // TODO: Add createdAt to UserEntity if needed

        // Calculate projects added this week
        const projectsThisWeek = allProjects.filter(p =>
            p.createdAt && new Date(p.createdAt) >= oneWeekAgo
        ).length;

        // Calculate average rating (placeholder - you can implement actual rating logic)
        // For now, using a fixed value or calculate from project ratings if available
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
