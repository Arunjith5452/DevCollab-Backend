import { ApplicationEntity } from "@/domain/entities/application.entity";
import { ApplicationResponseDTO } from "../dtos/project/res/application-response.dto";
import { ProjectResponseDTO } from "../dtos/project/res/project-response.dto";

export class ApplicationResponseMapper {
    static toDTO(application: ApplicationEntity): ApplicationResponseDTO {
        return {
            _id: application.id || "",
            _reason: application.reason || "",
            _status: application.status || "pending",
            _createdAt: application.createdAt ? application.createdAt.toISOString() : new Date().toISOString(),
            _techStack: application.techStack || [],
            _projectId: { _id: application.projectId, title: "", description: "" } as unknown as ProjectResponseDTO
        };
    }

    static toDTOList(applications: ApplicationEntity[]): ApplicationResponseDTO[] {
        return applications.map(app => this.toDTO(app));
    }
}
