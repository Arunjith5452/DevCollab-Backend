import { ProjectEntity } from "@/domain/entities/project.entity";
import { MemberWithUser, MongoMember, MongoUser } from "./interface/project.mapper.interface";
import { injectable } from "inversify";

@injectable()
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
      creatorId: typeof doc.creatorId === "object" && doc.creatorId ? doc.creatorId._id?.toString() : doc.creatorId?.toString(),
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
      creator: typeof doc.creatorId === "object" && doc.creatorId ? {
        name: doc.creatorId.name,
        email: doc.creatorId.email,
        avatar: doc.creatorId.profileImage ?? null,
      } : undefined,
      members: mongoMembers.map((m): MemberWithUser => {
        const base: MemberWithUser = {
          userId: typeof m.userId === "object" ? m.userId._id.toString() : m.userId.toString(),
          role: m.role,
          status: m.status,
          joinedAt: m.joinedAt ? new Date(m.joinedAt).toISOString() : 'nothing',
        };

        if (typeof m.userId === "object" && m.userId !== null) {
          const user = m.userId as MongoUser;
          base.user = {
            name: user.name,
            email: user.email,
            avatar: user.profileImage ?? null,
          };
        }

        return base;
      }),
    });
  }
}
