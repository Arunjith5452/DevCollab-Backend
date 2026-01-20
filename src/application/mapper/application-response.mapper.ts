import { ApplicationEntity } from "@/domain/entities/application.entity";
import { ApplicationResponseDTO } from "../dtos/project/res/application-response.dto";

export class ApplicationResponseMapper {
    static toDTO(application: ApplicationEntity): ApplicationResponseDTO {
        return {
            id: application.id!,
            userId: application.userId!,
            projectId: application.projectId,
            techStack: application.techStack!,
            profileUrl: application.profileUrl!,
            reason: application.reason!,
            status: application.status!,
            createdAt: application.createdAt!,
            updatedAt: application.updatedAt!
        };
    }

    static toDTOList(applications: ApplicationEntity[]): ApplicationResponseDTO[] {
        return applications.map(app => this.toDTO(app));
    }
}
