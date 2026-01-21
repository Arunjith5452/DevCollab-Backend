import { ProjectEntity } from "@/domain/entities/project.entity";
import { ProjectResponseDTO } from "@/application/dtos/project/res/project-response.dto";
import { injectable } from "inversify";

@injectable()
export class ProjectPresentationMapper {
    toResponseDTO(project: ProjectEntity): ProjectResponseDTO {
        return {
            id: project.id || "",
            _id: project.id || "",
            creatorId: project.creatorId,
            title: project.title,
            description: project.description,
            githubRepo: project.githubRepo,
            techStack: project.techStack,
            difficulty: project.difficulty,
            startDate: project.startDate,
            endDate: project.endDate,
            expectation: project.expectation,
            visibility: project.visibility,
            requiredRoles: project.requiredRoles,
            status: project.status,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            image: project.image,
            roleNeeded: (project.requiredRoles || []).map(r => r.role).join(", "),
            members: (project.members || []).map(m => ({
                userId: m.userId,
                role: m.role,
                joinedAt: m.joinedAt,
                status: m.status,
            })),
            creator: project.creator,
        };
    }
}
