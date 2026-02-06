import { ProjectEntity } from "@/domain/entities/project.entity";
import { MemberWithUser, MongoMember, MongoProject, MongoUser } from "./interface/project.mapper.interface";
import { injectable } from "inversify";

import { IPersistenceMapper } from "./interface/persistence-mapper.interface";

@injectable()
export class ProjectPersistenceMapper implements IPersistenceMapper<ProjectEntity, MongoProject> {
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

  fromMongo(doc: MongoProject): ProjectEntity {
    if (!doc) throw new Error("Project document is missing");

    const mongoMembers = doc.members as MongoMember[];

    const isPopulatedUser = (user: unknown): user is MongoUser => {
      return !!user && typeof user === 'object' && '_id' in user;
    };

    const creatorId = isPopulatedUser(doc.creatorId)
      ? doc.creatorId._id?.toString()
      : (doc.creatorId?.toString() || "DELETED_USER");

    return ProjectEntity.create({
      id: doc._id?.toString(),
      creatorId: creatorId,
      title: doc.title || "Untitled Project",
      description: doc.description || "",
      githubRepo: doc.githubRepo,
      techStack: doc.techStack || [],
      difficulty: doc.difficulty || "Beginner",
      startDate: doc.startDate,
      endDate: doc.endDate,
      expectation: doc.expectation,
      visibility: doc.visibility || "public",
      requiredRoles: doc.requiredRoles || [],
      status: doc.status || "active",
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      image: doc.image,
      creator: isPopulatedUser(doc.creatorId) ? {
        name: doc.creatorId.name || "Unknown User",
        email: doc.creatorId.email || "",
        avatar: doc.creatorId.profileImage ?? null,
      } : undefined,
      members: (mongoMembers || []).map((m): MemberWithUser => {
        const userId = typeof m.userId === "object" && m.userId
          ? m.userId._id?.toString()
          : (m.userId?.toString() || "DELETED_USER");

        const base: MemberWithUser = {
          userId: userId,
          role: m.role || "Member",
          status: m.status || "active",
          joinedAt: m.joinedAt ? new Date(m.joinedAt).toISOString() : new Date().toISOString(),
        };

        if (typeof m.userId === "object" && m.userId !== null) {
          const user = m.userId as MongoUser;
          base.user = {
            name: user.name || "Unknown User",
            email: user.email || "",
            avatar: user.profileImage ?? null,
          };
        }

        return base;
      }),
    });
  }
}
