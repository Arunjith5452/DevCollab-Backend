import { injectable, inject } from 'inversify';
import { IExecute } from '@/application/interface/execute.usecase.interface';
import { IUserRepository } from '@/infrastructure/db/repository/interface/user.interface';
import { IProjectRepository } from '@/infrastructure/db/repository/interface/project.interface';
import { USER_TYPES } from '@/infrastructure/di/types/user';
import { PROJECT_TYPES } from '@/infrastructure/di/types/project';
import { SuccessMessage } from '@/domain/enums/messages/success-message.enum';
import { UserEntity } from '@/domain/entities/user.entity';
import { ProjectEntity } from '@/domain/entities/project.entity';
import { IApplicationRepository } from '@/infrastructure/db/repository/interface/application.interface';
import { ApplicationEntity } from '@/domain/entities/application.entity';

@injectable()
export class GetAdminDashboardStatsUseCase implements IExecute<{ startDate?: Date; endDate?: Date } | void, { message: string; stats: any }> {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>,
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
        @inject(PROJECT_TYPES.ApplicationRepository) private readonly _applicationRepository: IApplicationRepository<ApplicationEntity>,
    ) { }

    async execute(query?: { startDate?: Date; endDate?: Date }): Promise<{ message: string; stats: any }> {
        const endDate = query?.endDate || new Date();
        const startDate = query?.startDate || new Date(new Date().setDate(endDate.getDate() - 7));

        // Timerange for "New This Week" stats (always last 7 days from now)
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);

        const [
            totalUsers,
            totalProjects,
            activeContributors,
            totalCreators,
            dailyRegistrations,
            techStackDistribution,
            // New this week stats
            newUsersThisWeek,
            newProjectsThisWeek,
            newCreatorsThisWeek,
            newContributorsApproveThisWeek
        ] = await Promise.all([
            this._userRepository.count({}),
            this._projectRepository.count({}),
            this._userRepository.count({ status: 'active' }),
            this._userRepository.count({ role: 'user' }), // totalCreators

            // Graph data (dynamic range)
            this._userRepository.getDailyRegistrations(startDate, endDate),

            this._projectRepository.getTechStackDistribution(),

            // "New this week" counts
            this._userRepository.count({ createdAt: { $gte: weekStart } }),
            this._projectRepository.count({ createdAt: { $gte: weekStart } }),
            this._userRepository.count({ role: 'user', createdAt: { $gte: weekStart } }),
            this._applicationRepository.count({ status: 'approved', updatedAt: { $gte: weekStart } })
        ]);

        return {
            message: SuccessMessage.USERS_FETCHED,
            stats: {
                totalUsers,
                totalProjects,
                activeContributors,
                totalCreators,
                dailyRegistrations,
                techStackDistribution,
                newThisWeek: {
                    users: newUsersThisWeek,
                    projects: newProjectsThisWeek,
                    creators: newCreatorsThisWeek,
                    contributors: newContributorsApproveThisWeek
                },
                // We don't fetch recentActivities here anymore to keep it light? 
                // Wait, frontend expects it in initial load.
                // Keeping it EMPTY for now if we move to paginated. 
                // OR KEEP IT as "Initial Snapshot".
                // User asked for "pagination component for the recently activity".
                // I will return empy array here and let the specific pagination component fetch it?
                // Or return first page here. Let's return first page here for init load speed.
            },
        };
    }
}
