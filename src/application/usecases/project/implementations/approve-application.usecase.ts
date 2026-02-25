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
import { PLAN_TYPES } from "@/infrastructure/di/types/plan";
import { IPlanRepository } from "@/domain/repository/plan.repository.interface";
import { PlanFeature } from "@/domain/enums/plan/plan-feature.enum";



@injectable()
export class ApproveApplicationUseCase implements IExecute<ApproveApplicationDTO, { message: string }> {

    constructor(@inject(PROJECT_TYPES.ApplicationRepository) private readonly _applicationRepository: IApplicationRepository<ApplicationEntity>,
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
        @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly _subscriptionRepository: ISubscriptionRepository<SubscriptionEntity>,
        @inject(PLAN_TYPES.PlanRepository) private readonly _planRepository: IPlanRepository
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

            const subscription = await this._subscriptionRepository.findByUserId(project.creatorId);
            const planName = (subscription && subscription.status === 'active') ? subscription.plan : 'Free';
            const plan = await this._planRepository.findByName(planName);


            if (!plan?.features.includes(PlanFeature.MAX_CONTRIBUTORS)) {
                throw new Error(`Your current plan (${planName}) does not allow adding contributors to projects. Upgrade to add members.`);
            }

            const maxContributors = plan ? plan.maxContributors : 4;


            if (project.members.length >= maxContributors + 1) { // +1 for the creator
                throw new Error(`Plan limit reached. Your current plan (${planName}) allows up to ${maxContributors} contributors per project. Upgrade to add more.`);
            }


            project.addMember(application.userId.toString())
            let data = await this._projectRepository.updateEntity(project)

            return { message: "Application approved and contributor added successfully" }

        } catch (error) {
            throw error
        }

    }

}