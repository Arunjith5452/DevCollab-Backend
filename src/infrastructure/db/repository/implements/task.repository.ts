import { inject, injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { TaskEntity } from "@/domain/entities/task.entity";
import { ITask } from "../../interface/task.interface";
import { ITasksRepository } from "@/domain/repository/task.interface";
import { TaskPersistenceMapper } from "@/infrastructure/mappers/task-persistence.mapper";

@injectable()

export class TaskRepository extends BaseRepository<TaskEntity, ITask> implements ITasksRepository<TaskEntity> {

    constructor(
        @inject("TaskModel") model: Model<ITask>,
        @inject(TaskPersistenceMapper) mapper: TaskPersistenceMapper
    ) {
        super(model, mapper)
    }

    async findTask(filter: FilterQuery<TaskEntity>, options: { skip: number; limit: number }): Promise<TaskEntity[]> {
        return this.find(filter, options);
    }

    async findById(id: string): Promise<TaskEntity | null> {
        return super.findById(id);
    }

    async createTask(data: TaskEntity): Promise<TaskEntity> {
        return this.create(data);
    }

    async findByProjectAndStatus(projectId: string, status: string): Promise<TaskEntity[]> {
        return this.find({ projectId, status } as unknown as FilterQuery<TaskEntity>, { skip: 0, limit: 1000 })
    }

    async findByProjectStatusAndAssignee(projectId: string, status: string, assigneeId: string): Promise<TaskEntity[]> {
        return this.find({ projectId, status, assignedId: assigneeId } as unknown as FilterQuery<TaskEntity>, { skip: 0, limit: 1000 })
    }

    async updateTask(task: TaskEntity): Promise<TaskEntity> {
        // toMongo returns full object. update expects UpdateQuery.
        // We use findByIdAndUpdate. Base update does exactly this.
        if (!task.id) throw new Error("Task ID required for update");
        const updated = await this.update(task.id, this.mapper.toMongo(task) as unknown as UpdateQuery<TaskEntity>);
        if (!updated) throw new Error("Task not found");
        return updated;
    }
}