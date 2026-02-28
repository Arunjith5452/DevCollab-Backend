import { ApplyToProjectDTO } from "@/application/dtos/project/apply-project.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ApplicationEntity } from "@/domain/entities/application.entity";
import { UserEntity } from "@/domain/entities/user.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { IApplicationRepository } from "@/domain/repository/application.interface";
import { IUserRepository } from "@/domain/repository/user.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { inject, injectable } from "inversify";
import { SUBSCRIPTION_TYPES } from "@/infrastructure/di/types/subscription";
import { SubscriptionEntity } from "@/domain/entities/subscription.entity";
import { ISubscriptionRepository } from "@/domain/repository/subscription.interface";
import { PLAN_TYPES } from "@/infrastructure/di/types/plan";
import { IPlanRepository } from "@/domain/repository/plan.repository.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { Role } from "@/domain/enums/role.enum";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { PlanFeature } from "@/domain/enums/plan/plan-feature.enum";



@injectable()
export class ApplyToProjectUseCase implements IExecute<ApplyToProjectDTO, { message: string }> {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>,
        @inject(PROJECT_TYPES.ApplicationRepository) private readonly _applicationRepository: IApplicationRepository<ApplicationEntity>,
        @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly _subscriptionRepository: ISubscriptionRepository<SubscriptionEntity>,
        @inject(PLAN_TYPES.PlanRepository) private readonly _planRepository: IPlanRepository,
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>
    ) { }

    async execute({ techStack, profileUrl, reason, userId, projectId }: ApplyToProjectDTO & { userId: string, projectId: string }): Promise<{ message: string }> {
        try {

            const user = await this._userRepository.findById(userId)

            if (!user) throw new Error(ErrorMessage.USER_NOT_FOUND)

            const subscription = await this._subscriptionRepository.findByUserId(userId);
            const planName = (subscription && subscription.status === 'active') ? subscription.plan : 'Free';
            const plan = await this._planRepository.findByName(planName);

            if (!plan?.features.includes(PlanFeature.JOIN_PROJECTS)) {
                throw new Error(`Your current plan (${planName}) does not support joining projects. Upgrade to participate in projects.`);
            }

            const participationLimit = plan ? plan.participationLimit : 1;


            const joinedProjectsCount = await this._projectRepository.count({
                'members.userId': userId,
                'members.role': { $ne: Role.CREATOR }
            });

            const project = await this._projectRepository.findById(projectId);
            if (!project) throw new Error("Project not found");

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const projectEndDate = new Date(project.endDate);
            projectEndDate.setHours(0, 0, 0, 0);

            if (projectEndDate < today) {
                throw new Error("This project is no longer accepting applications as its end date has passed.");
            }

            if (joinedProjectsCount >= participationLimit) {
                throw new Error(`Plan limit reached. Your current plan (${planName}) allows joining ${participationLimit} project(s). Upgrade to join more.`);
            }

            const existing = await this._applicationRepository.findExistingApplication(
                userId,
                projectId
            );

            if (existing) {
                throw new Error("You have already applied to this project");
            }

            const application = ApplicationEntity.create({
                userId,
                projectId,
                techStack,
                profileUrl,
                reason
            })

            await this._applicationRepository.applyToProject(application)

            return {
                message: "Application Sent Successfully"
            }
        } catch (error) {
            throw error
        }
    }
}