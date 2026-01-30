import { ApplicationEntity } from "@/domain/entities/application.entity";
import { ApplicationResponseDTO } from "@/application/dtos/project/res/application-response.dto";
import { ProjectPresentationMapper } from "./project-presentation.mapper";
import { inject, injectable } from "inversify";
import { WithUser } from "./interface/application.mapper";

import { ProjectEntity } from "@/domain/entities/project.entity";

type ApplicationWithRelations = ApplicationEntity & WithUser & { project?: ProjectEntity };

@injectable()
export class ApplicationPresentationMapper {
    constructor(
        @inject(ProjectPresentationMapper) private readonly _projectMapper: ProjectPresentationMapper
    ) { }

    toResponseDTO(application: ApplicationWithRelations): ApplicationResponseDTO {
        const project = application.project ? this._projectMapper.toResponseDTO(application.project) : {
            id: application.projectId,
            _id: application.projectId,
            title: "Unknown Project",
            description: "This project may have been removed.",
            techStack: [],
            creatorId: "",
            difficulty: "Beginner",
            startDate: new Date(),
            endDate: new Date(),
            visibility: "public",
            requiredRoles: [],
            status: "active",
            createdAt: new Date(),
            members: [],
        };

        return {
            _id: application.id || "",
            _reason: application.reason,
            _status: application.status,
            _createdAt: application.createdAt.toISOString(),
            _techStack: application.techStack,
            _projectId: project
        };
    }
}
