
export const PROJECT_TYPES = {
    ProjectController: Symbol.for("ProjectController"),
    CreateProjectUseCase: Symbol.for("CreateProjectUseCase"),
    ListProjectUseCase: Symbol.for("ListProjectUseCase"),
    ProjectRepository: Symbol.for("ProjectRepository"),
    ProjectDetailsUseCase: Symbol.for("ProjectDetailsUseCase"),
    ApplyToProjectUseCase: Symbol.for("ApplyToProjectUseCase"),
    ApplicationRepository: Symbol.for("ApplicationRepository"),
    GetPendingApplicationUseCase: Symbol.for("GetPendingApplicationUseCase"),
    ApproveApplcationUseCase: Symbol.for("ApproveApplcationUseCase"),
    RejectApplicationUseCase: Symbol.for("RejectApplicationUseCase"),
    GetMyCreatedProjectUseCase: Symbol.for("GetMyCreatedProjectUseCase"),
    GetMyAppliedProjectUseCase: Symbol.for("GetMyAppliedProjectUseCase"),
    UpdateProjectUseCase: Symbol.for("UpdateProjectUseCase"),
    GetProjectForEditUseCase:Symbol.for("GetProjectForEditUseCase")
}