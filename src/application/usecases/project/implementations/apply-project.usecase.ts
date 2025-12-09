import { ApplyToProjectDTO } from "@/application/dtos/project/apply-project.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ApplicationEntity } from "@/domain/entities/application.entity";
import { UserEntity } from "@/domain/entities/user.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { IApplicationRepository } from "@/infrastructure/db/repository/interface/application.interface";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { inject, injectable } from "inversify";


@injectable()
export class ApplyToProjectUseCase implements IExecute<ApplyToProjectDTO, { message: string }> {
    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<UserEntity>,
        @inject(PROJECT_TYPES.ApplicationRepository) private readonly _applicationRepository: IApplicationRepository<ApplicationEntity>
    ) { }

    async execute({ techStack, profileUrl, reason, userId, projectId }: ApplyToProjectDTO & { userId: string, projectId: string }): Promise<{ message: string }> {
        try {

            const user = await this._userRepository.findById(userId)

            if (!user) throw new Error(ErrorMessage.USER_NOT_FOUND)

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