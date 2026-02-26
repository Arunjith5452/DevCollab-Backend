import { ApplicationEntity } from "@/domain/entities/application.entity";
import { BaseRepository } from "./base.repository";
import { IApplicationRepository } from "@/domain/repository/application.interface";
import { inject, injectable } from "inversify";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { ApplicationPersistenceMapper } from "@/infrastructure/mappers/application-persistence.mapper";
import { MongoApplication } from "@/infrastructure/mappers/interface/application.mapper";

@injectable()
export class ApplicationRepository extends BaseRepository<ApplicationEntity, MongoApplication> implements IApplicationRepository<ApplicationEntity> {
    constructor(
        @inject("ApplicationModel") model: Model<MongoApplication>,
        @inject(ApplicationPersistenceMapper) mapper: ApplicationPersistenceMapper
    ) {
        super(model, mapper)
    }

    async applyToProject(data: ApplicationEntity): Promise<ApplicationEntity> {
        return this.create(data);
    }

    async findExistingApplication(userId: string, projectId: string): Promise<ApplicationEntity | null> {
        return this.findOne({ userId: new Types.ObjectId(userId), projectId: new Types.ObjectId(projectId) } as unknown as FilterQuery<ApplicationEntity>);
    }

    async getPendingByProject(projectId: string): Promise<ApplicationEntity[]> {
        const docs = await this.model
            .find({ projectId: new Types.ObjectId(projectId), status: "pending" } as FilterQuery<MongoApplication>)
            .populate("userId", "name githubProfile bio profileImage")
            .sort({ createdAt: -1 })
            .limit(100)
            .lean()
            .exec();

        return docs.map(doc => this.mapper.fromMongo(doc as MongoApplication));
    }

    async updateStatus(applicationId: string, newStatus: string): Promise<void> {
        await this.update(applicationId, { status: newStatus } as UpdateQuery<ApplicationEntity>);
    }

    async findAppliedProjectsByUser(userId: string, options?: { skip: number; limit: number }): Promise<{ applications: ApplicationEntity[], total: number }> {
        const query = { userId: new Types.ObjectId(userId) };
        const total = await this.model.countDocuments(query as FilterQuery<MongoApplication>);
        let mongoQuery = this.model.find(query as FilterQuery<MongoApplication>)
            .populate("projectId")
            .sort({ createdAt: -1 });

        if (options) {
            mongoQuery = mongoQuery.skip(options.skip).limit(options.limit);
        }

        const docs = await mongoQuery.lean().exec();
        return {
            applications: docs.map(doc => this.mapper.fromMongo(doc as MongoApplication)),
            total
        };
    }
    async findLatestApproved(limit: number): Promise<ApplicationEntity[]> {
        const docs = await this.model
            .find({ status: "approved" } as FilterQuery<MongoApplication>)
            .populate("userId", "name")
            .populate("projectId", "title")
            .sort({ updatedAt: -1 })
            .limit(limit)
            .lean()
            .exec();

        return docs.map(doc => this.mapper.fromMongo(doc as MongoApplication));
    }
}