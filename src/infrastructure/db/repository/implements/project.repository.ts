import { ProjectEntity } from "@/domain/entities/project.entity";
import { BaseRepository } from "./base.repository";
import { IProjectRepository } from "../interface/project.interface";
import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { ProjectPersistenceMapper } from "@/infrastructure/mappers/project-persistence.mapper";
type PopulatedUser = { _id: string; name: string };


@injectable()
export class ProjectRepository extends BaseRepository<ProjectEntity> implements IProjectRepository<ProjectEntity> {

    private readonly projectPersistenceMapper: ProjectPersistenceMapper;

    constructor(@inject("ProjectModel") model: Model<ProjectEntity>, projectPersistenceMapper: ProjectPersistenceMapper) {
        super(model)
        this.projectPersistenceMapper = projectPersistenceMapper
    }

    async createProject(data: ProjectEntity): Promise<ProjectEntity> {
        const mongoData = this.projectPersistenceMapper.toMongo(data)
        const createProject = await this.create(mongoData)
        return await this.projectPersistenceMapper.fromMongo(createProject)
    }

    async findByIdWithCreator(id: string): Promise<ProjectEntity | null> {
        const project = await this.findById(id)
        return project ? this.projectPersistenceMapper.fromMongo(project) : null
    }

    async findEntityById(id: string): Promise<ProjectEntity | null> {
        const doc = await this.findById(id);
        if (!doc) return null;
        return this.projectPersistenceMapper.fromMongo(doc);
    }
    async updateEntity(project: ProjectEntity): Promise<ProjectEntity | null> {
        const mongoData = this.projectPersistenceMapper.toMongo(project);

        const updatedDoc = await this.model.findByIdAndUpdate(
            project.id,
            mongoData,
            { new: true }
        );

        return updatedDoc
            ? this.projectPersistenceMapper.fromMongo(updatedDoc)
            : null;
    }

    async findByCreatorId(userId: string): Promise<ProjectEntity[]> {
        const docs = await this.model.find({ creatorId: userId })
            .sort({ createdAt: -1 })
            .lean();

        return docs.map(doc => this.projectPersistenceMapper.fromMongo(doc));
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

        return doc ? this.projectPersistenceMapper.fromMongo(doc) : null;
    }

    async getProjectMembersForAssignee( projectId: string ): Promise<{ userId: string; name: string }[]> {

        const projectDoc = await this.model
            .findById(projectId)
            .select("members")
            .populate("members.userId", "name")
            .lean()
            .exec()

        if (!projectDoc?.members) return []

        return projectDoc.members.flatMap(m => {
            if (m.userId && typeof m.userId === "object") {
                const user = m.userId as PopulatedUser;
                return [{ userId: user._id, name: user.name }]
            }
            return []
        })
    }
}