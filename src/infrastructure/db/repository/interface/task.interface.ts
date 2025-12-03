import { TaskEntity } from "@/domain/entities/task.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface ITasksRepository<T> extends IBaseRepository<T> {

    createTask(data: TaskEntity): Promise<T>

}