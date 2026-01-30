import { ApplicationEntity } from "@/domain/entities/application.entity";
import { ApplicationResponseDTO } from "../dtos/project/res/application-response.dto";

export class ApplicationResponseMapper {
    static toDTO(application: ApplicationEntity): ApplicationResponseDTO {
        return {
            _id: application.id!,
            _reason: application.reason!,
            _status: application.status!,
            _createdAt: application.createdAt!.toISOString(),
            _techStack: application.techStack!,
            _projectId: {} as any // This is a fallback for legacy code
        };
    }

    static toDTOList(applications: ApplicationEntity[]): ApplicationResponseDTO[] {
        return applications.map(app => this.toDTO(app));
    }
}
