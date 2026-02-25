import { injectable, inject } from "inversify";
import { IPlanRepository } from "@/domain/repository/plan.repository.interface";
import { PLAN_TYPES } from "@/infrastructure/di/types/plan";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { PlanPresentationMapper } from "@/infrastructure/mappers/plan-presentation.mapper";
import { PlanResponseDTO } from "@/application/dtos/plans/plan-response.dto";

@injectable()
export class GetActivePlansUseCase implements IExecute<{ page?: number; limit?: number }, { plans: PlanResponseDTO[]; total: number }> {
    constructor(
        @inject(PLAN_TYPES.PlanRepository) private _planRepository: IPlanRepository,
        @inject(PLAN_TYPES.PlanPresentationMapper) private _planPresentationMapper: PlanPresentationMapper
    ) { }

    async execute(params?: { page?: number; limit?: number }): Promise<{ plans: PlanResponseDTO[]; total: number }> {
        const { data, total } = await this._planRepository.findAllPaginated({ isActive: true }, params?.page, params?.limit);
        return {
            plans: this._planPresentationMapper.toResponseDTOs(data),
            total
        };
    }
}
