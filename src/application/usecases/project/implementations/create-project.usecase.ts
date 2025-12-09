import { CreateProjectDTO } from "@/application/dtos/project/createProject.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { UserEntity } from "@/domain/entities/user.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { Role } from "@/domain/enums/role.enum";
import { Status } from "@/domain/enums/status.enums";
import { IProjectRepository } from "@/infrastructure/db/repository/interface/project.interface";
import { IUserRepository } from "@/infrastructure/db/repository/interface/user.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { inject, injectable } from "inversify";


@injectable()
export class CreateProjectUseCase implements IExecute<{ userId: string, dto: CreateProjectDTO }, { message: string }> {
    constructor(@inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>
    ) { }

    async execute({ userId, dto }: { userId: string, dto: CreateProjectDTO }): Promise<{ message: string }> {

        try {

            const user = await this._userRepository.findById(userId)

            if (!user) {
                throw new Error(ErrorMessage.USER_NOT_FOUND)
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
                creatorId: user.id!,
                image:dto.image,
                members: [
                    {
                        userId: user.id!,
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