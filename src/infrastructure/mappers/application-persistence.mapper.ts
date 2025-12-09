import { ApplicationEntity } from "@/domain/entities/application.entity";
import { WithUser } from "./interface/application.mapper";

export class ApplicationPersistenceMapper {

    toMongo(application: ApplicationEntity) {
        return {
            userId: application.userId,
            projectId: application.projectId,
            techStack: application.techStack,
            profileUrl: application.profileUrl,
            reason: application.reason,
            status: application.status
        }
    }

    async fromMongo(doc: any): Promise<ApplicationEntity & WithUser> {
        const entity = ApplicationEntity.create({
            id: doc._id,
            userId: typeof doc.userId === "string" ? doc.userId : doc.userId._id,
            projectId: doc.projectId,
            techStack: doc.techStack,
            profileUrl: doc.profileUrl,
            reason: doc.reason,
            status: doc.status,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        }) as ApplicationEntity & WithUser

        if (typeof doc.userId === "object") {
            entity.user = {
                name: doc.userId.name,
                github: doc.userId.githubProfile || null,
                bio: doc.userId.bio || null,
                profileImage: doc.userId.profileImage || null,
            };
        }

        return entity;
    }

}