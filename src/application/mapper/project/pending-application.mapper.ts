import { ResponsePendingApplicationDto } from "@/application/dtos/project/res/pending-application.dto";
import { ApplicationEntity } from "@/domain/entities/application.entity";

interface ApplicationWithUser extends ApplicationEntity {
    user?: {
        name: string;
        github: string | null;
        profileImage: string | null;
        bio: string | null;
    };
}

export class PendingApplicationMapper {
    toResponse(application: ApplicationWithUser): ResponsePendingApplicationDto {
        return {
            id: application.id!,
            user: {
                name: application.user?.name || "Anonymous User",
                github: application.user?.github || null,
                profileImage: application.user?.profileImage || null,
                bio: application.user?.bio || "",
            },
            profileUrl: application.profileUrl || "",
            reason: application.reason || "",
            techStack: application.techStack || [],
            createdAt: application.createdAt
                ? new Date(application.createdAt).toISOString()
                : new Date().toISOString(),
        };
    }
}