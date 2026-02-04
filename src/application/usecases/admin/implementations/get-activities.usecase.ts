import { injectable, inject } from 'inversify';
import { IExecute } from '@/application/interface/execute.usecase.interface';
import { IUserRepository } from '@/infrastructure/db/repository/interface/user.interface';
import { IProjectRepository } from '@/infrastructure/db/repository/interface/project.interface';
import { IApplicationRepository } from '@/infrastructure/db/repository/interface/application.interface';
import { USER_TYPES } from '@/infrastructure/di/types/user';
import { PROJECT_TYPES } from '@/infrastructure/di/types/project';
import { UserEntity } from '@/domain/entities/user.entity';
import { ProjectEntity } from '@/domain/entities/project.entity';
import { ApplicationEntity } from '@/domain/entities/application.entity';

@injectable()
export class GetAdminActivitiesUseCase implements IExecute<{ page: number; limit: number }, { activities: any[]; total: number }> {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>,
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
        @inject(PROJECT_TYPES.ApplicationRepository) private readonly _applicationRepository: IApplicationRepository<ApplicationEntity>,
    ) { }

    async execute(query: { page: number; limit: number }): Promise<{ activities: any[]; total: number }> {
        const { page = 1, limit = 10 } = query;
        const fetchLimit = page * limit;

        // Fetch enough data from each source to ensure correct interleaving
        const [users, projects, applications] = await Promise.all([
            this._userRepository.find({}, { skip: 0, limit: fetchLimit }),
            this._projectRepository.find({}, { skip: 0, limit: fetchLimit }),
            this._applicationRepository.findLatestApproved(fetchLimit)
        ]);

        // Normalize activities
        const allActivities = [
            ...users.map((u: any) => ({
                id: u.id || u._id,
                type: 'user_joined',
                title: `User ${u.username || u.name} joined the platform`,
                desc: `New registration`,
                time: u.createdAt,
                timestamp: new Date(u.createdAt).getTime()
            })),
            ...projects.map((p: any) => ({
                id: p.id || p._id,
                type: 'project_created',
                title: `Project "${p.title}" created`,
                desc: `${p.techStack?.join(', ') || 'Tech stack'} stack`,
                time: p.createdAt,
                timestamp: new Date(p.createdAt).getTime()
            })),
            ...applications.map((a: any) => ({
                id: a.id || a._id,
                type: 'contributed_project',
                title: `User ${a.userId?.name || 'Unknown'} contributed to "${a.projectId?.title || 'Project'}"`,
                desc: `Application Approved`,
                time: a.updatedAt,
                timestamp: new Date(a.updatedAt).getTime()
            }))
        ];

        // Sort by timestamp descending
        allActivities.sort((a, b) => b.timestamp - a.timestamp);

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
