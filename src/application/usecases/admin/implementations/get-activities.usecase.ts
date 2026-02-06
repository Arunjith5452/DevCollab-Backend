import { injectable, inject } from 'inversify';
import { IExecute } from '@/application/interface/execute.usecase.interface';
import { IUserRepository } from '@/domain/repository/user.interface';
import { IProjectRepository } from '@/domain/repository/project.interface';
import { IApplicationRepository } from '@/domain/repository/application.interface';
import { USER_TYPES } from '@/infrastructure/di/types/user';
import { PROJECT_TYPES } from '@/infrastructure/di/types/project';
import { UserEntity } from '@/domain/entities/user.entity';
import { ProjectEntity } from '@/domain/entities/project.entity';
import { ApplicationEntity } from '@/domain/entities/application.entity';
import { ActivityItem } from '@/application/dtos/admin/activity.dto';

@injectable()
export class GetAdminActivitiesUseCase implements IExecute<{ page: number; limit: number }, { activities: ActivityItem[]; total: number }> {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>,
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
        @inject(PROJECT_TYPES.ApplicationRepository) private readonly _applicationRepository: IApplicationRepository<ApplicationEntity>
    ) { }

    async execute(query: { page: number; limit: number }): Promise<{ activities: ActivityItem[]; total: number }> {
        const { page = 1, limit = 10 } = query;
        const fetchLimit = page * limit;

        // Fetch enough data from each source to ensure correct interleaving
        const [users, projects, applications] = await Promise.all([
            this._userRepository.find({}, { skip: 0, limit: fetchLimit }),
            this._projectRepository.find({}, { skip: 0, limit: fetchLimit }),
            this._applicationRepository.findLatestApproved(fetchLimit)
        ]);

        // Normalize activities
        const allActivities: ActivityItem[] = [
            ...users.map((u: UserEntity): ActivityItem => ({
                type: 'user' as const,
                id: u.id!,
                name: u.username,
                title: u.username,
                desc: `Joined the platform`,
                email: u.email,
                createdAt: u.createdAt!
            })),
            ...projects.map((p: ProjectEntity): ActivityItem => ({
                type: 'project' as const,
                id: p.id!,
                name: p.title,
                title: p.title,
                desc: `New Project Created`,
                createdAt: p.createdAt
            })),
            ...applications.map((a: ApplicationEntity): ActivityItem => ({
                type: 'application' as const,
                id: a.id!,
                name: 'Application',
                title: 'New Application',
                desc: `Status: ${a.status}`,
                status: a.status,
                createdAt: a.updatedAt
            }))
        ];

        // Sort by createdAt descending
        allActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Calculate simplified total (sum of all counts approximations)
        // This is not perfect as we only fetched a subset, but for UI pagination we can estimate or fetch real counts.
        // Fetching real counts is cheap.
        const [totalUsers, totalProjects, totalApps] = await Promise.all([
            this._userRepository.count({}),
            this._projectRepository.count({}),
            this._applicationRepository.count({ status: 'approved' })
        ]);
        const total = totalUsers + totalProjects + totalApps;

        // Slice the requested page
        const startIndex = (page - 1) * limit;
        const paginatedActivities = allActivities.slice(startIndex, startIndex + limit);

        return {
            activities: paginatedActivities,
            total
        };
    }
}
