import { ProjectEntity } from "@/domain/entities/project.entity";
import { BaseRepository } from "./base.repository";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { inject, injectable } from "inversify";
import { FilterQuery, Model, UpdateQuery, Types, PipelineStage } from "mongoose";
import { ProjectPersistenceMapper } from "@/infrastructure/mappers/project-persistence.mapper";
import { MongoProject, MongoMember, MongoUser } from "@/infrastructure/mappers/interface/project.mapper.interface";
import { ProjectFilter } from "@/domain/types/project-filter.type";


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
            .populate({
                path: "members.userId",
                select: "name email avatar profileImage",
            })
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

    async findFeatured(filter: ProjectFilter, options: { skip: number; limit: number }): Promise<ProjectEntity[]> {
        if (filter._id) {
            filter._id = new Types.ObjectId(filter._id as string);
        }

        const aggregationPipeline: PipelineStage[] = [
            { $match: filter },
            {
                $lookup: {
                    from: "applications",
                    localField: "_id",
                    foreignField: "projectId",
                    as: "applications"
                }
            },
            {
                $addFields: {
                    applicationCount: { $size: "$applications" }
                }
            },
            { $sort: { applicationCount: -1 } },
            { $skip: options.skip },
            { $limit: options.limit },
            {
                $lookup: {
                    from: "users",
                    localField: "creatorId",
                    foreignField: "_id",
                    as: "creator"
                }
            },
            { $unwind: "$creator" },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    techStack: 1,
                    difficulty: 1,
                    startDate: 1,
                    endDate: 1,
                    expectation: 1,
                    visibility: 1,
                    requiredRoles: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    image: 1,
                    members: 1,
                    creatorId: {
                        _id: "$creator._id",
                        name: "$creator.name",
                        email: "$creator.email",
                        profileImage: "$creator.profileImage"
                    }
                }
            }
        ];

        const docs = await this.model.aggregate(aggregationPipeline).exec();
        return docs.map(doc => this.mapper.fromMongo(doc as unknown as MongoProject));
    }
    async getTechStackDistribution(): Promise<{ name: string; count: number }[]> {
        const result = await this.model.aggregate([
            { $unwind: "$techStack" },
            { $group: { _id: "$techStack", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $project: { _id: 0, name: "$_id", count: 1 } }
        ]);
        return result;
    }
}