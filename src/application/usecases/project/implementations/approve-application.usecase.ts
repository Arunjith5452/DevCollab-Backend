import { ApproveApplicationDTO } from "@/application/dtos/project/approve-application.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ApplicationEntity } from "@/domain/entities/application.entity";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { ApplicationStatus } from "@/domain/enums/project/application.enums";
import { IApplicationRepository } from "@/domain/repository/application.interface";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject, injectable } from "inversify";
import { ISubscriptionRepository } from "@/domain/repository/subscription.interface";
import { SubscriptionEntity } from "@/domain/entities/subscription.entity";
import { SUBSCRIPTION_TYPES } from "@/infrastructure/di/types/subscription";


@injectable()
export class ApproveApplcationUseCase implements IExecute<ApproveApplicationDTO, { message: string }> {

    constructor(@inject(PROJECT_TYPES.ApplicationRepository) private readonly _applicationRepository: IApplicationRepository<ApplicationEntity>,
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
        @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly _subscriptionRepository: ISubscriptionRepository<SubscriptionEntity>
    ) { }

    async execute({ applicationId, projectId }: ApproveApplicationDTO): Promise<{ message: string }> {

        try {

            const application = await this._applicationRepository.findById(applicationId);
            if (!application) {
                throw new Error("Application not found");
            }
            await this._applicationRepository.updateStatus(applicationId, ApplicationStatus.APPROVED)

            const project = await this._projectRepository.findEntityById(projectId)

            if (!project) {
                throw new Error("Project not found");
            }

            // Check Subscription Limit
            const subscription = await this._subscriptionRepository.findByUserId(project.creatorId);
            const isPro = subscription?.plan === 'pro' && subscription?.status === 'active';

            if (!isPro) {
                // Free plan limit: 4 contributors + 1 creator = 5 members
                if (project.members.length >= 5) {
                    throw new Error("Free plan limit reached. Partial updates restricted. Upgrade to Pro to add more contributors.");
                }
            }

            project.addMember(application.userId.toString())
            let data = await this._projectRepository.updateEntity(project)

            return { message: "Application approved and contributor added successfully" }

        } catch (error) {
            throw error
        }

    }

}