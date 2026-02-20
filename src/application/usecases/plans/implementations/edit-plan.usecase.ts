import { injectable, inject } from "inversify";
import { IPlanRepository } from "@/domain/repository/plan.repository.interface";
import { PLAN_TYPES } from "@/infrastructure/di/types/plan";
import { EditPlanDTO } from "@/application/dtos/plans/edit-plan.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { PlanPresentationMapper } from "@/infrastructure/mappers/plan-presentation.mapper";
import { PlanResponseDTO } from "@/application/dtos/plans/plan-response.dto";
import { AppError } from "@/shared/utils/app-error";

@injectable()
export class EditPlanUseCase implements IExecute<EditPlanDTO, PlanResponseDTO> {
    constructor(
        @inject(PLAN_TYPES.PlanRepository) private _planRepository: IPlanRepository,
        @inject(PLAN_TYPES.PlanPresentationMapper) private _planPresentationMapper: PlanPresentationMapper
    ) { }

    async execute(data: EditPlanDTO): Promise<PlanResponseDTO> {
        const plan = await this._planRepository.findById(data.id);
        if (!plan) throw new AppError("Plan not found", 404);

        if (plan.name.toLowerCase() === 'free') {
            plan.updateDetails({
                description: data.description,
                features: data.features
            });
        } else {
            plan.updateDetails({
                name: data.name,
                description: data.description,
                price: data.price,
                durationInDays: data.durationInDays,
                features: data.features,
                projectLimit: data.projectLimit,
                maxContributors: data.maxContributors,
                participationLimit: data.participationLimit
            });
        }

        const updatedPlan = await this._planRepository.update(plan);
        return this._planPresentationMapper.toResponseDTO(updatedPlan);
    }
}
