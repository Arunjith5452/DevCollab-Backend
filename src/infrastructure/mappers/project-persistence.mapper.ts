import { ProjectEntity } from "@/domain/entities/project.entity";
import { MongoMember } from "./interface/project.mapper.interface";

export class ProjectPersistenceMapper {
  toMongo(project: ProjectEntity) {
    return {
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
      members: project.members,
    };
  }

  fromMongo(doc: any): ProjectEntity {
    return ProjectEntity.create({
      id: doc._id?.toString(),
      creatorId: doc.creatorId?.toString(),
      title: doc.title,
      description: doc.description,
      githubRepo: doc.githubRepo,
      techStack: doc.techStack,
      difficulty: doc.difficulty,
      startDate: doc.startDate,
      endDate: doc.endDate,
      expectation: doc.expectation,
      visibility: doc.visibility,
      requiredRoles: doc.requiredRoles,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      image: doc.image,
      members: (doc.members as MongoMember[])?.map((m) => ({
        userId: m.userId.toString(),
        role: m.role,
        joinedAt: m.joinedAt,
        status: m.status
      })) || []

    });
  }
}
