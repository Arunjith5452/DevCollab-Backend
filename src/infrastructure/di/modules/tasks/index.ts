import { TaskRepository } from "@/infrastructure/db/repository/implements/task.repository";
import { ContainerModule } from "inversify";
import { TASK_TYPES } from "../../types";
import { Model } from "mongoose";
import { taskModel } from "@/infrastructure/db/models/task.model";
import { CreateTaskUseCase } from "@/application/usecases/tasks/implementations/create-task.usecase";


export const TaskModule = new ContainerModule(({ bind }) => {

    bind<TaskRepository>(TASK_TYPES.TaskRepository).to(TaskRepository)
    bind<Model<any>>("TaskModel").toConstantValue(taskModel)
    bind<CreateTaskUseCase>(TASK_TYPES.CreateTaskUseCase).to(CreateTaskUseCase)

})