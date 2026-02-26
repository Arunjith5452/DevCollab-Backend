import { ContainerModule } from "inversify";
import { PLAN_TYPES } from "../types/plan";
import { IPlanRepository } from "@/domain/repository/plan.repository.interface";
import { PlanRepository } from "@/infrastructure/db/repository/implements/plan.repository";
import { CreatePlanUseCase } from "@/application/usecases/plans/implementations/create-plan.usecase";
import { EditPlanUseCase } from "@/application/usecases/plans/implementations/edit-plan.usecase";
import { GetActivePlansUseCase } from "@/application/usecases/plans/implementations/get-active-plans.usecase";
import { GetAllPlansUseCase } from "@/application/usecases/plans/implementations/get-all-plans.usecase";
import { TogglePlanStatusUseCase } from "@/application/usecases/plans/implementations/toggle-plan-status.usecase";
import { PlanController } from "@/presentation/http/controllers/plan.controller";
import { PlanPersistenceMapper } from "@/infrastructure/mappers/plan-persistence.mapper";

export const planModule = new ContainerModule(({ bind }) => {
    bind<IPlanRepository>(PLAN_TYPES.PlanRepository).to(PlanRepository);

    bind<CreatePlanUseCase>(PLAN_TYPES.CreatePlanUseCase).to(CreatePlanUseCase);
    bind<EditPlanUseCase>(PLAN_TYPES.EditPlanUseCase).to(EditPlanUseCase);
    bind<GetActivePlansUseCase>(PLAN_TYPES.GetActivePlansUseCase).to(GetActivePlansUseCase);
    bind<GetAllPlansUseCase>(PLAN_TYPES.GetAllPlansUseCase).to(GetAllPlansUseCase);
    bind<TogglePlanStatusUseCase>(PLAN_TYPES.TogglePlanStatusUseCase).to(TogglePlanStatusUseCase);

    bind<PlanController>(PLAN_TYPES.PlanController).to(PlanController);
    bind<PlanPersistenceMapper>(PLAN_TYPES.PlanPersistenceMapper).to(PlanPersistenceMapper);
});
