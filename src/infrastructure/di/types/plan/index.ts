export const PLAN_TYPES = {
    PlanRepository: Symbol.for("PlanRepository"),
    CreatePlanUseCase: Symbol.for("CreatePlanUseCase"),
    EditPlanUseCase: Symbol.for("EditPlanUseCase"),
    GetActivePlansUseCase: Symbol.for("GetActivePlansUseCase"),
    GetAllPlansUseCase: Symbol.for("GetAllPlansUseCase"),
    TogglePlanStatusUseCase: Symbol.for("TogglePlanStatusUseCase"),
    PlanController: Symbol.for("PlanController"),
    PlanPersistenceMapper: Symbol.for("PlanPersistenceMapper"),
    PlanPresentationMapper: Symbol.for("PlanPresentationMapper"),
};
