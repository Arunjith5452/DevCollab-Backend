
export const TASK_TYPES = {

    TaskController: Symbol.for("TaskController"),
    TaskRepository: Symbol.for("TaskRepository"),
    CreateTaskUseCase: Symbol.for("CreateTaskUseCase"),
    GetCreatorTasksUseCase: Symbol.for("GetCreatorTasksUseCase"),
    GetContributorTaskUseCase: Symbol.for("GetContributorTaskUseCase")

}