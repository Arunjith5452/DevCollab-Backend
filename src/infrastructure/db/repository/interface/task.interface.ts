import { TaskEntity } from "@/domain/entities/task.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface ITasksRepository<T> extends IBaseRepository<T> {

    createTask(data: TaskEntity): Promise<T>
    findByProjectAndStatus(projectId: string, status: string): Promise<T[]>
    findByProjectStatusAndAssignee(projectId: string, status: string, assigneeId: string): Promise<T[]>
    updateTask(task: TaskEntity): Promise<T>

}