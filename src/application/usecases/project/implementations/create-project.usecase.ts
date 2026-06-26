import { CreateProjectDTO } from "@/application/dtos/project/createProject.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { UserEntity } from "@/domain/entities/user.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { Role } from "@/domain/enums/role.enum";
import { Status } from "@/domain/enums/status.enums";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { IUserRepository } from "@/domain/repository/user.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { IGitHubService } from "@/application/interface/git.service.interface";
import { inject, injectable } from "inversify";
import { ISubscriptionRepository } from "@/domain/repository/subscription.interface";
import { SubscriptionEntity } from "@/domain/entities/subscription.entity";
import { SUBSCRIPTION_TYPES } from "@/infrastructure/di/types/subscription";
import { PLAN_TYPES } from "@/infrastructure/di/types/plan";
import { IPlanRepository } from "@/domain/repository/plan.repository.interface";
import { PlanFeature } from "@/domain/enums/plan/plan-feature.enum";


@injectable()
export class CreateProjectUseCase implements IExecute<{ userId: string, dto: CreateProjectDTO }, { message: string }> {
    constructor(@inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>,
        @inject(COMMON_TYPES.GitHubService) private readonly _gitHubService: IGitHubService,
        @inject(SUBSCRIPTION_TYPES.SubscriptionRepository) private readonly _subscriptionRepository: ISubscriptionRepository<SubscriptionEntity>,
        @inject(PLAN_TYPES.PlanRepository) private readonly _planRepository: IPlanRepository
    ) { }

    async execute({ userId, dto }: { userId: string, dto: CreateProjectDTO }): Promise<{ message: string }> {

        try {

            let user: UserEntity | null = null;

            if (dto.createGithubRepo) {
                user = await this._userRepository.findEntityByIdWithToken(userId)
            } else {
                user = await this._userRepository.findById(userId)
            }

            if (!user) {
                throw new Error(ErrorMessage.USER_NOT_FOUND)
            }

            if (dto.createGithubRepo) {
                if (!user.githubAccessToken) {
                    throw new Error("GitHub account not connected. Please connect your GitHub account in your profile.")
                }
                const repoUrl = await this._gitHubService.createRepository(user.githubAccessToken, dto.title, dto.description);
                dto.githubRepo = repoUrl;
            }

            const subscription = await this._subscriptionRepository.findByUserId(userId);
            const planName = (subscription && subscription.status === 'active') ? subscription.plan : 'Free';

            const plan = await this._planRepository.findByName(planName);

            if (!plan?.features.includes(PlanFeature.CREATE_PROJECTS)) {
                throw new Error(`Your current plan (${planName}) does not support project creation. Upgrade to create projects.`);
            }

            const projectLimit = plan ? plan.projectLimit : 1;


            const projectCount = await this._projectRepository.count({ creatorId: userId });

            if (projectCount >= projectLimit) {
                throw new Error(`Plan limit reached. Your current plan (${planName}) allows ${projectLimit} project(s). Upgrade to create more.`);
            }

            if (!user.id) {
                throw new Error("User ID is missing from the user entity");
            }

            const project = ProjectEntity.create({
                title: dto.title,
                description: dto.description,
                githubRepo: dto.githubRepo,
                techStack: dto.techStack,
                difficulty: dto.difficulty,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                expectation: dto.expectation,
                visibility: dto.visibility,
                requiredRoles: dto.requiredRoles,
                creatorId: user.id,
                image: dto.image,
                members: [
                    {
                        userId: user.id,
                        role: Role.CREATOR,
                        joinedAt: new Date().toISOString(),
                        status: Status.ACTIVE,
                    },
                ],
            });

            await this._projectRepository.createProject(project)

            return { message: "Project created successFully" }

        } catch (error) {

            throw error

        }

    }
}