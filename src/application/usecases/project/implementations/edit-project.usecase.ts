import { UpdateProjectDTO } from "@/application/dtos/project/edit-project.dto";
import { deleteFile } from "@/infrastructure/providers/s3-bucket/s3Service";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { UserEntity } from "@/domain/entities/user.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { IProjectRepository } from "@/infrastructure/db/repository/interface/project.interface";
import { IUserRepository } from "@/infrastructure/db/repository/interface/user.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { inject } from "inversify";



export class UpdateProjectUseCase implements IExecute<{ userId: string; projectId: string; dto: UpdateProjectDTO }, { message: string }> {

    constructor(@inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>
    ) { }

    async execute({ userId, projectId, dto }: { userId: string; projectId: string; dto: UpdateProjectDTO }): Promise<{ message: string }> {
        try {
            const user = await this._userRepository.findById(userId);
            if (!user) throw new Error(ErrorMessage.USER_NOT_FOUND);

            const project = await this._projectRepository.findEntityById(projectId);
            if (!project) throw new Error(ErrorMessage.PROJECT_NOT_FOUND);

            if (project.creatorId.toString() !== user.id) {
                throw new Error(ErrorMessage.UNAUTHORIZED);
            }

            const oldImage = project.image;

            project.updateProject({
                ...dto,
                requiredRoles: dto.requiredRoles?.map(r => ({
                    role: r.role ?? "",
                    count: r.count ?? "",
                    experience: r.experience ?? ""
                })),
                startDate: dto.startDate ? new Date(dto.startDate) : project.startDate,
                endDate: dto.endDate ? new Date(dto.endDate) : project.endDate
            });


            await this._projectRepository.updateEntity(project);

            if (dto.image && oldImage && dto.image !== oldImage) {
                await deleteFile(oldImage);
            }

            return { message: "Project updated successfully" };
        } catch (error) {
            throw error
        }
    }
}
