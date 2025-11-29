import { ApplicationEntity } from "@/domain/entities/application.entity";
import { BaseRepository } from "./base.repository";
import { IApplicationRepository } from "../interface/application.interface";
import { inject, injectable } from "inversify";
import { Model } from "mongoose";
import { ApplicationPersistenceMapper } from "@/infrastructure/mappers/application-persistence.mapper";

@injectable()
export class ApplicationRepository extends BaseRepository<ApplicationEntity> implements IApplicationRepository<ApplicationEntity> {
    private readonly _applicationPersistenceMapper: ApplicationPersistenceMapper
    constructor(@inject("ApplicationModel") model: Model<ApplicationEntity>, applicationPersistenceMapper: ApplicationPersistenceMapper) {
        super(model)
        this._applicationPersistenceMapper = applicationPersistenceMapper
    }

    async applyToProject(data: ApplicationEntity): Promise<ApplicationEntity> {
        const mongoData = this._applicationPersistenceMapper.toMongo(data)
        const apply = await this.create(mongoData)
        return await this._applicationPersistenceMapper.fromMongo(apply)
    }

    async findExistingApplication(userId: string, projectId: string): Promise<ApplicationEntity | null> {
        const application = await this.findOne({ userId, projectId });
        return application
            ? this._applicationPersistenceMapper.fromMongo(application)
            : null;
    }
    async getPendingByProject(projectId: string): Promise<ApplicationEntity[]> {
        const docs = await this.model
            .find({ projectId, status: "pending" })
            .populate("userId", "name githubProfile bio profileImage")
            .sort({ createdAt: -1 })
            .skip(0)
            .limit(100)
            .lean()
            .exec();

        return Promise.all(
            docs.map(doc => this._applicationPersistenceMapper.fromMongo(doc))
        );
    }
    async updateStatus(applicationId: string, newStatus: string): Promise<void> {
        await this.updateOne(
            { _id: applicationId },
            { $set: { status: newStatus } }
        );
    }
    async findAppliedProjectsByUser(userId: string): Promise<ApplicationEntity[]> {
        const docs = await this.model
            .find({ userId })
            .populate("projectId")
            .sort({ createdAt: -1 })
            .lean()

        return await Promise.all(
            docs.map(doc => this._applicationPersistenceMapper.fromMongo(doc))
        );
    }


}