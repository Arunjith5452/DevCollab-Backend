
export const TASK_TYPES = {

    TaskController: Symbol.for("TaskController"),
    TaskRepository: Symbol.for("TaskRepository"),
    CreateTaskUseCase: Symbol.for("CreateTaskUseCase"),
    GetCreatorTasksUseCase: Symbol.for("GetCreatorTasksUseCase"),
    GetContributorTaskUseCase: Symbol.for("GetContributorTaskUseCase"),
    GetProjectAssigneeUseCase: Symbol.for("GetProjectAssigneeUseCase"),
    AddCommentUseCase: Symbol.for("AddCommentUseCase"),
    StartTaskUseCase: Symbol.for("StartTaskUseCase"),
    SubmitWorkUseCase: Symbol.for("SubmitWorkUseCase"),
    ApproveTaskUseCase: Symbol.for("ApproveTaskUseCase"),
    RequestImprovementUseCase: Symbol.for("RequestImprovementUseCase"),
    UpdateTaskCriteriaUseCase: Symbol.for("UpdateTaskCriteriaUseCase"),
    TaskResponseMapper: Symbol.for("TaskResponseMapper")

}