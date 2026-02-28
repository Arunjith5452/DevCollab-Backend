import { IExecute } from "@/application/interface/execute.usecase.interface";
import { UserEntity } from "@/domain/entities/user.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { IUserRepository } from "@/domain/repository/user.interface";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { inject, injectable } from "inversify";

import { UserPresentationMapper } from "@/infrastructure/mappers/user-presentation.mapper";
import { UserResponseDTO, UserActivity } from "@/application/dtos/user/res/user-response.dto";

import { IProjectRepository } from "@/domain/repository/project.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { IApplicationRepository } from "@/domain/repository/application.interface";
import { ApplicationEntity } from "@/domain/entities/application.entity";
import { ApplicationStatus } from "@/domain/enums/project/application.enums";
import { ProjectEntity } from "@/domain/entities/project.entity";

import { ISubscriptionRepository } from "@/domain/repository/subscription.interface";
import { SubscriptionEntity } from "@/domain/entities/subscription.entity";
import { SUBSCRIPTION_TYPES } from "@/infrastructure/di/types/subscription";

@injectable()
export class GetUserProfileUseCase implements IExecute<{ userId: string }, UserResponseDTO> {

  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>,
    @inject(USER_TYPES.UserPresentationMapper) private readonly _userPresentationMapper: UserPresentationMapper,
    @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
    @inject(PROJECT_TYPES.ApplicationRepository) private readonly _applicationRepository: IApplicationRepository<ApplicationEntity>,
    @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly _subscriptionRepository: ISubscriptionRepository<SubscriptionEntity>
  ) { }

  async execute({ userId }: { userId: string }): Promise<UserResponseDTO> {
    try {

      const user = await this._userRepository.findEntityByIdWithToken(userId);
      if (!user) throw new Error(ErrorMessage.USER_NOT_FOUND);

      const [createdProjectsCount, contributionsCount, recentProjects, recentApps, subscription] = await Promise.all([
        this._projectRepository.count({ creatorId: userId }),
        this._applicationRepository.count({ userId, status: ApplicationStatus.APPROVED }),
        this._projectRepository.find({ creatorId: userId }, { skip: 0, limit: 5 }),
        this._applicationRepository.find({ userId, status: ApplicationStatus.APPROVED }, { skip: 0, limit: 5 }),
        this._subscriptionRepository.findByUserId(userId)
      ]);


      const activities: UserActivity[] = [
        ...recentProjects.map(p => ({
          type: 'project_created' as const,
          title: `Created Project: ${p.title}`,
          timestamp: p.createdAt.toISOString()
        })),
        ...recentApps.map(a => {
          const appWithProject = a as ApplicationEntity & { project?: ProjectEntity };
          return {
            type: 'joined_project' as const,
            title: `Joined Project: ${appWithProject.project?.title || 'Unknown Project'}`,
            timestamp: appWithProject.createdAt.toISOString()
          };
        })
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 3);

      return this._userPresentationMapper.toResponseDTO(user, {
        createdProjects: createdProjectsCount,
        contributions: contributionsCount,
        activities,
        subscription,
      });

    } catch (error) {
      throw error
    }
  }
}
