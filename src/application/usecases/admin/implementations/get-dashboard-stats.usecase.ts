import { injectable, inject } from 'inversify';
import { IExecute } from '@/application/interface/execute.usecase.interface';
import { IUserRepository } from '@/domain/repository/user.interface';
import { IProjectRepository } from '@/domain/repository/project.interface';
import { USER_TYPES } from '@/infrastructure/di/types/user';
import { PROJECT_TYPES } from '@/infrastructure/di/types/project';
import { SuccessMessage } from '@/domain/enums/messages/success-message.enum';
import { UserEntity } from '@/domain/entities/user.entity';
import { ProjectEntity } from '@/domain/entities/project.entity';
import { IApplicationRepository } from '@/domain/repository/application.interface';
import { ApplicationEntity } from '@/domain/entities/application.entity';
import { DashboardStatsDTO, DailyRegistrationDTO, TechStackDistributionDTO, NewThisWeekStatsDTO } from '@/application/dtos/admin/dashboard-stats.dto';

@injectable()
export class GetAdminDashboardStatsUseCase implements IExecute<{ startDate?: Date; endDate?: Date } | void, { message: string; stats: DashboardStatsDTO }> {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>,
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
        @inject(PROJECT_TYPES.ApplicationRepository) private readonly _applicationRepository: IApplicationRepository<ApplicationEntity>,
    ) { }

    async execute(query?: { startDate?: Date; endDate?: Date }): Promise<{ message: string; stats: DashboardStatsDTO }> {
        const endDate = query?.endDate || new Date();
        const startDate = query?.startDate || new Date(new Date().setDate(endDate.getDate() - 7));

        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);

        const [
            totalUsers,
            totalProjects,
            activeContributors,
            totalCreators,
            dailyRegistrations,
            techStackDistribution,

            newUsersThisWeek,
            newProjectsThisWeek,
            newCreatorsThisWeek,
            newContributorsApproveThisWeek
        ] = await Promise.all([
            this._userRepository.count({}),
            this._projectRepository.count({}),
            this._userRepository.count({ status: 'active' }),
            this._userRepository.count({ role: 'user' }),

            this._userRepository.getDailyRegistrations(startDate, endDate),

            this._projectRepository.getTechStackDistribution(),

            this._userRepository.count({ createdAt: { $gte: weekStart } }),
            this._projectRepository.count({ createdAt: { $gte: weekStart } }),
            this._userRepository.count({ role: 'user', createdAt: { $gte: weekStart } }),
            this._applicationRepository.count({ status: 'approved', updatedAt: { $gte: weekStart } })
        ]);

        return {
            message: SuccessMessage.USERS_FETCHED,
            stats: new DashboardStatsDTO({
                totalUsers,
                totalProjects,
                activeContributors,
                totalCreators,
                dailyRegistrations: dailyRegistrations.map(d => new DailyRegistrationDTO(d)),
                techStackDistribution: techStackDistribution.map(t => new TechStackDistributionDTO({ _id: t.name, count: t.count })),
                newThisWeek: new NewThisWeekStatsDTO({
                    users: newUsersThisWeek,
                    projects: newProjectsThisWeek,
                    creators: newCreatorsThisWeek,
                    contributors: newContributorsApproveThisWeek
                }),
            }),
        };
    }
}
