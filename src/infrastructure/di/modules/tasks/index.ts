import { TaskRepository } from "@/infrastructure/db/repository/implements/task.repository";
import { ContainerModule } from "inversify";
import { Model } from "mongoose";
import { taskModel } from "@/infrastructure/db/models/task.model";
import { CreateTaskUseCase } from "@/application/usecases/tasks/implementations/create-task.usecase";
import { TASK_TYPES } from "../../types/tasks";
import { GetCreatorTasksUseCase } from "@/application/usecases/tasks/implementations/get-creator-tasks.usecase";
import { GetContributorTaskUseCase } from "@/application/usecases/tasks/implementations/get-contributor-tasks.usecase";
import { GetProjectAssigneeUseCase } from "@/application/usecases/tasks/implementations/get-project-assigees.usecase";
import { ITask } from "@/infrastructure/db/interface/task.interface";


import { AddCommentUseCase } from "@/application/usecases/tasks/implementations/add-comment.usecase";
import { StartTaskUseCase } from "@/application/usecases/tasks/implementations/start-task.usecase";
import { SubmitWorkUseCase } from "@/application/usecases/tasks/implementations/submit-work.usecase";
import { ApproveTaskUseCase } from "@/application/usecases/tasks/implementations/approve-task.usecase";
import { RequestImprovementUseCase } from "@/application/usecases/tasks/implementations/request-improvement.usecase";
import { UpdateTaskCriteriaUseCase } from "@/application/usecases/tasks/implementations/update-task-criteria.usecase";
import { TaskResponseMapper } from "@/application/mapper/tasks/task-response.mapper";

export const TaskModule = new ContainerModule(({ bind }) => {

    bind<TaskRepository>(TASK_TYPES.TaskRepository).to(TaskRepository)
    bind<Model<ITask>>("TaskModel").toConstantValue(taskModel)
    bind<CreateTaskUseCase>(TASK_TYPES.CreateTaskUseCase).to(CreateTaskUseCase)
    bind<GetCreatorTasksUseCase>(TASK_TYPES.GetCreatorTasksUseCase).to(GetCreatorTasksUseCase)
    bind<GetContributorTaskUseCase>(TASK_TYPES.GetContributorTaskUseCase).to(GetContributorTaskUseCase)
    bind<GetProjectAssigneeUseCase>(TASK_TYPES.GetProjectAssigneeUseCase).to(GetProjectAssigneeUseCase)
    bind<AddCommentUseCase>(TASK_TYPES.AddCommentUseCase).to(AddCommentUseCase)
    bind<StartTaskUseCase>(TASK_TYPES.StartTaskUseCase).to(StartTaskUseCase)
    bind<SubmitWorkUseCase>(TASK_TYPES.SubmitWorkUseCase).to(SubmitWorkUseCase)
    bind<ApproveTaskUseCase>(TASK_TYPES.ApproveTaskUseCase).to(ApproveTaskUseCase)
    bind<RequestImprovementUseCase>(TASK_TYPES.RequestImprovementUseCase).to(RequestImprovementUseCase)
    bind<UpdateTaskCriteriaUseCase>(TASK_TYPES.UpdateTaskCriteriaUseCase).to(UpdateTaskCriteriaUseCase)
    bind<TaskResponseMapper>(TASK_TYPES.TaskResponseMapper).to(TaskResponseMapper)
})  