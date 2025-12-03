import { inject, injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";
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


    async createTask(data: TaskEntity): Promise<TaskEntity> {
        const mongoData = this.taskPersistenceMapper.toMongo(data)
        const createTask = await this.create(mongoData)
        return await this.taskPersistenceMapper.fromMongo(createTask)
    }

}