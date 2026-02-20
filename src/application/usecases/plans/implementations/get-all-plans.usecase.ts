import { injectable, inject } from "inversify";
import { IPlanRepository } from "@/domain/repository/plan.repository.interface";
import { PLAN_TYPES } from "@/infrastructure/di/types/plan";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { PlanPresentationMapper } from "@/infrastructure/mappers/plan-presentation.mapper";
import { PlanResponseDTO } from "@/application/dtos/plans/plan-response.dto";

@injectable()
export class GetAllPlansUseCase implements IExecute<void, PlanResponseDTO[]> {
    constructor(
        @inject(PLAN_TYPES.PlanRepository) private _planRepository: IPlanRepository,
        @inject(PLAN_TYPES.PlanPresentationMapper) private _planPresentationMapper: PlanPresentationMapper
    ) { }

    async execute(): Promise<PlanResponseDTO[]> {
        const plans = await this._planRepository.findAll();
        return this._planPresentationMapper.toResponseDTOs(plans);
    }
}
