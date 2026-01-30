import { ProjectEntity } from "@/domain/entities/project.entity";
import { BaseRepository } from "./base.repository";
import { IProjectRepository } from "../interface/project.interface";
import { inject, injectable } from "inversify";
import { Model, FilterQuery } from "mongoose";
import { ProjectPersistenceMapper } from "@/infrastructure/mappers/project-persistence.mapper";
import { MongoProject, MongoMember, MongoUser } from "@/infrastructure/mappers/interface/project.mapper.interface";


@injectable()
export class ProjectRepository extends BaseRepository<ProjectEntity> implements IProjectRepository<ProjectEntity> {


    constructor(
        @inject("ProjectModel") model: Model<ProjectEntity>,
        @inject(ProjectPersistenceMapper) private readonly _projectPersistenceMapper: ProjectPersistenceMapper
    ) {
        super(model)
    }

    async find(filter: FilterQuery<ProjectEntity>, options: { skip: number; limit: number }): Promise<ProjectEntity[]> {
        const docs = await this.model
            .find(filter)
            .populate("creatorId", "name email profileImage")
            .sort({ createdAt: -1 })
            .skip(options.skip)
            .limit(options.limit)
            .lean()
            .exec();

        return (docs as unknown as MongoProject[]).map(doc => this._projectPersistenceMapper.fromMongo(doc));
    }

    async createProject(data: ProjectEntity): Promise<ProjectEntity> {
        const mongoData = this._projectPersistenceMapper.toMongo(data)
        const createProject = await this.create(mongoData)
        return this._projectPersistenceMapper.fromMongo(createProject as unknown as MongoProject)
    }

    async findByIdWithCreator(id: string): Promise<ProjectEntity | null> {
        const doc = await this.model
            .findById(id)
            .populate("creatorId", "name email profileImage")
            .lean()
            .exec();

        return doc ? this._projectPersistenceMapper.fromMongo(doc as unknown as MongoProject) : null
    }

    async findEntityById(id: string): Promise<ProjectEntity | null> {
        const doc = await this.model.findById(id).lean().exec();
        if (!doc) return null;
        return this._projectPersistenceMapper.fromMongo(doc as unknown as MongoProject);
    }
    async updateEntity(project: ProjectEntity): Promise<ProjectEntity | null> {
        const mongoData = this._projectPersistenceMapper.toMongo(project);

        const updatedDoc = await this.model.findByIdAndUpdate(
            project.id,
            mongoData,
            { new: true }
        ).lean().exec();

        return updatedDoc
            ? this._projectPersistenceMapper.fromMongo(updatedDoc as unknown as MongoProject)
            : null;
    }

    async findByCreatorId(userId: string): Promise<ProjectEntity[]> {
        const docs = await this.model.find({ creatorId: userId })
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        return docs.map(doc => this._projectPersistenceMapper.fromMongo(doc as unknown as MongoProject));
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

        return doc ? this._projectPersistenceMapper.fromMongo(doc as unknown as MongoProject) : null;
    }

    async getProjectMembersForAssignee(projectId: string): Promise<{ userId: string; name: string }[]> {

        const projectDoc = await this.model
            .findById(projectId)
            .select("members")
            .populate("members.userId", "name")
            .lean()
            .exec()

        if (!projectDoc?.members) return []

        return (projectDoc.members as MongoMember[]).flatMap(m => {
            if (m.userId && typeof m.userId === "object") {
                const user = m.userId as MongoUser;
                return [{ userId: user._id, name: user.name }]
            }
            return []
        })
    }
}