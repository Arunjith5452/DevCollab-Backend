import { ApplicationEntity } from "@/domain/entities/application.entity";
import { WithUser, MongoApplication } from "./interface/application.mapper";
import { ProjectPersistenceMapper } from "./project-persistence.mapper";
import { inject, injectable } from "inversify";
import { MongoProject } from "./interface/project.mapper.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { IPersistenceMapper } from "./interface/persistence-mapper.interface";

@injectable()
export class ApplicationPersistenceMapper implements IPersistenceMapper<ApplicationEntity, MongoApplication> {
    constructor(
        @inject(ProjectPersistenceMapper) private readonly _projectPersistenceMapper: ProjectPersistenceMapper
    ) { }

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

    fromMongo(doc: MongoApplication): ApplicationEntity & WithUser & { project?: ProjectEntity } {
        const userId = typeof doc.userId === "object" ? doc.userId._id.toString() : doc.userId;

        let projectIdStr = "MISSING_PROJECT";
        if (doc.projectId) {
            projectIdStr = typeof doc.projectId === "object" ? (doc.projectId._id?.toString() || "MISSING_PROJECT") : doc.projectId;
        }

        const entity = ApplicationEntity.create({
            id: doc._id.toString(),
            userId: userId,
            projectId: projectIdStr,
            techStack: doc.techStack || [],
            profileUrl: doc.profileUrl || "",
            reason: doc.reason || "",
            status: doc.status || "pending",
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        }) as ApplicationEntity & WithUser & { project?: ProjectEntity };

        if (doc.projectId && typeof doc.projectId === "object") {
            entity.project = this._projectPersistenceMapper.fromMongo(doc.projectId as MongoProject);
        }

        if (typeof doc.userId === "object") {
            entity.user = {
                name: doc.userId.name || "Unknown User",
                github: doc.userId.githubProfile || null,
                bio: doc.userId.bio || null,
                profileImage: doc.userId.profileImage || null,
            };
        }

        return entity;
    }
}