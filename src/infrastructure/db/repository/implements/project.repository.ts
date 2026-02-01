import { ProjectEntity } from "@/domain/entities/project.entity";
import { BaseRepository } from "./base.repository";
import { IProjectRepository } from "../interface/project.interface";
import { inject, injectable } from "inversify";
import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { ProjectPersistenceMapper } from "@/infrastructure/mappers/project-persistence.mapper";
import { MongoProject, MongoMember, MongoUser } from "@/infrastructure/mappers/interface/project.mapper.interface";


@injectable()
export class ProjectRepository extends BaseRepository<ProjectEntity, MongoProject> implements IProjectRepository<ProjectEntity> {

    constructor(
        @inject("ProjectModel") model: Model<MongoProject>,
        @inject(ProjectPersistenceMapper) mapper: ProjectPersistenceMapper
    ) {
        super(model, mapper)
    }

    async find(filter: FilterQuery<ProjectEntity>, options: { skip: number; limit: number }): Promise<ProjectEntity[]> {
        // Override base find to populate creator
        const docs = await this.model
            .find(filter as FilterQuery<MongoProject>)
            .populate("creatorId", "name email profileImage")
            .sort({ createdAt: -1 })
            .skip(options.skip)
            .limit(options.limit)
            .lean()
            .exec();

        return docs.map(doc => this.mapper.fromMongo(doc as unknown as MongoProject));
    }

    async createProject(data: ProjectEntity): Promise<ProjectEntity> {
        return this.create(data);
    }

    async findByIdWithCreator(id: string): Promise<ProjectEntity | null> {
        const doc = await this.model
            .findById(id)
            .populate("creatorId", "name email profileImage")
            .lean()
            .exec();

        return doc ? this.mapper.fromMongo(doc as unknown as MongoProject) : null;
    }

    async findEntityById(id: string): Promise<ProjectEntity | null> {
        return this.findById(id);
    }

    async updateEntity(project: ProjectEntity): Promise<ProjectEntity | null> {
        if (!project.id) throw new Error("Project ID is required for update");
        return this.update(project.id, this.mapper.toMongo(project) as unknown as UpdateQuery<ProjectEntity>);
    }

    async findByCreatorId(userId: string): Promise<ProjectEntity[]> {
        const docs = await this.model.find({ creatorId: userId })
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        return docs.map(doc => this.mapper.fromMongo(doc as unknown as MongoProject));
    }

    async findByIdWithPopulation(projectId: string): Promise<ProjectEntity | null> {
        const doc = await this.model
            .findById(projectId)
            .populate({
                path: "members.userId",
                select: "name email avatar",
            })
            .lean()
            .exec();

        return doc ? this.mapper.fromMongo(doc as unknown as MongoProject) : null;
    }

    async getProjectMembersForAssignee(projectId: string): Promise<{ userId: string; name: string }[]> {
        const projectDoc = await this.model
            .findById(projectId)
            .select("members")
            .populate("members.userId", "name")
            .lean()
            .exec();

        if (!projectDoc?.members) return [];

        return (projectDoc.members as MongoMember[]).flatMap(m => {
            if (m.userId && typeof m.userId === "object") {
                const user = m.userId as MongoUser;
                return [{ userId: user._id, name: user.name }];
            }
            return [];
        });
    }
}