import { TaskRepository } from "@/infrastructure/db/repository/implements/task.repository";
import { ContainerModule } from "inversify";
import { Model } from "mongoose";
import { taskModel } from "@/infrastructure/db/models/task.model";
import { CreateTaskUseCase } from "@/application/usecases/tasks/implementations/create-task.usecase";
import { TASK_TYPES } from "../../types/tasks";
import { GetCreatorTasksUseCase } from "@/application/usecases/tasks/implementations/get-creator-tasks.usecase";
import { GetContributorTaskUseCase } from "@/application/usecases/tasks/implementations/get-contributor-tasks.usecase";
import { GetProjectAssigneeUseCase } from "@/application/usecases/tasks/implementations/get-project-assigees.usecase";


export const TaskModule = new ContainerModule(({ bind }) => {

    bind<TaskRepository>(TASK_TYPES.TaskRepository).to(TaskRepository)
    bind<Model<any>>("TaskModel").toConstantValue(taskModel)
    bind<CreateTaskUseCase>(TASK_TYPES.CreateTaskUseCase).to(CreateTaskUseCase)
    bind<GetCreatorTasksUseCase>(TASK_TYPES.GetCreatorTasksUseCase).to(GetCreatorTasksUseCase)
    bind<GetContributorTaskUseCase>(TASK_TYPES.GetContributorTaskUseCase).to(GetContributorTaskUseCase)
    bind<GetProjectAssigneeUseCase>(TASK_TYPES.GetProjectAssigneeUseCase).to(GetProjectAssigneeUseCase)
})  