import { ProjectEntity } from "@/domain/entities/project.entity";
import { MemberWithUser, MongoMember } from "./interface/project.mapper.interface";

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

    const mongoMembers = doc.members as MongoMember[];

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
      members: mongoMembers.map((m): MemberWithUser => {
        const base: MemberWithUser = {
          userId: typeof m.userId === "object" ? m.userId._id.toString() : m.userId.toString(),
          role: m.role,
          status: m.status,
          joinedAt: m.joinedAt? new Date(m.joinedAt).toISOString() : 'nothing',
        };

        if (typeof m.userId === "object") {
          base.user = {
            name: m.userId.name,
            email: m.userId.email,
            avatar: m.userId.avatar ?? null,
          };
        }

        return base;
      }),
    });
  }
}
