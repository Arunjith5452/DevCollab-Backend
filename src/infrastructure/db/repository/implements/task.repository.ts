import { inject, injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { FilterQuery, Model } from "mongoose";
import { TaskEntity } from "@/domain/entities/task.entity";
import { ITasksRepository } from "../interface/task.interface";
import { TaskPersistenceMapper } from "@/infrastructure/mappers/task-persistence.mapper";

@injectable()
export class TaskRepository extends BaseRepository<TaskEntity> implements ITasksRepository<TaskEntity> {

    private readonly taskPersistenceMapper: TaskPersistenceMapper;

    constructor(@inject("TaskModel") model: Model<TaskEntity>, taskPersistenceMapper: TaskPersistenceMapper) {
        super(model)
        this.taskPersistenceMapper = taskPersistenceMapper
    }

    async findTask(filter: FilterQuery<TaskEntity>, options: { skip: number; limit: number }): Promise<TaskEntity[]> {

        const docs = await this.model
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(options.skip)
            .limit(options.limit)
            .lean()
            .exec();

        return Promise.all(
            docs.map(doc => this.taskPersistenceMapper.fromMongo(doc))
        );
    }

    async findById(id: string): Promise<TaskEntity | null> {
        const doc = await this.model.findById(id).lean().exec();
        if (!doc) return null;
        return this.taskPersistenceMapper.fromMongo(doc);
    }

    async createTask(data: TaskEntity): Promise<TaskEntity> {
        const mongoData = this.taskPersistenceMapper.toMongo(data)
        const createTask = await this.create(mongoData)
        return await this.taskPersistenceMapper.fromMongo(createTask)
    }

    async findByProjectAndStatus(projectId: string, status: string): Promise<TaskEntity[]> {
        const docs = await this.model.find({ projectId, status }).sort({ createdAt: -1 }).lean().exec();
        return Promise.all(docs.map(doc => this.taskPersistenceMapper.fromMongo(doc)));
    }

    async findByProjectStatusAndAssignee(projectId: string, status: string, assigneeId: string): Promise<TaskEntity[]> {
        const docs = await this.model.find({ projectId, status, assignedId: assigneeId }).sort({ createdAt: -1 }).lean().exec();
        return Promise.all(docs.map(doc => this.taskPersistenceMapper.fromMongo(doc)));
    }

    async updateTask(task: TaskEntity): Promise<TaskEntity> {
        const mongoData = this.taskPersistenceMapper.toMongo(task);
        console.log("mongodataupdateTask", mongoData)
        const updated = await this.model
            .findByIdAndUpdate(task.id, mongoData, { new: true })
            .lean()
            .exec();
        return this.taskPersistenceMapper.fromMongo(updated!);
    }
}