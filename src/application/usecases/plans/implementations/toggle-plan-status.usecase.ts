import { injectable, inject } from "inversify";
import { IPlanRepository } from "@/domain/repository/plan.repository.interface";
import { PLAN_TYPES } from "@/infrastructure/di/types/plan";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { PlanPresentationMapper } from "@/infrastructure/mappers/plan-presentation.mapper";
import { PlanResponseDTO } from "@/application/dtos/plans/plan-response.dto";
import { AppError } from "@/shared/utils/app-error";

@injectable()
export class TogglePlanStatusUseCase implements IExecute<string, PlanResponseDTO> {
    constructor(
        @inject(PLAN_TYPES.PlanRepository) private _planRepository: IPlanRepository,
        @inject(PLAN_TYPES.PlanPresentationMapper) private _planPresentationMapper: PlanPresentationMapper
    ) { }

    async execute(id: string): Promise<PlanResponseDTO> {
        const plan = await this._planRepository.findById(id);
        if (!plan) throw new AppError("Plan not found", 404);

        if (plan.isActive) {
            if (plan.name.toLowerCase() === 'free') {
                throw new AppError("The default Free plan cannot be deactivated.", 400);
            }
            plan.deactivate();
        } else {
            plan.activate();
        }

        const updatedPlan = await this._planRepository.update(plan.id!, {
            isActive: plan.isActive
        });
        if (!updatedPlan) throw new AppError("Failed to update plan status", 500);
        return this._planPresentationMapper.toResponseDTO(updatedPlan);

    }
}
