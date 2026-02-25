import { injectable, inject } from "inversify";
import { IPlanRepository } from "@/domain/repository/plan.repository.interface";
import { PlanEntity } from "@/domain/entities/plan.entity";
import { PLAN_TYPES } from "@/infrastructure/di/types/plan";
import { CreatePlanDTO } from "@/application/dtos/plans/create-plan.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { PlanPresentationMapper } from "@/infrastructure/mappers/plan-presentation.mapper";
import { PlanResponseDTO } from "@/application/dtos/plans/plan-response.dto";
import { AppError } from "@/shared/utils/app-error";

@injectable()
export class CreatePlanUseCase implements IExecute<CreatePlanDTO, PlanResponseDTO> {
    constructor(
        @inject(PLAN_TYPES.PlanRepository) private _planRepository: IPlanRepository,
        @inject(PLAN_TYPES.PlanPresentationMapper) private _planPresentationMapper: PlanPresentationMapper
    ) { }

    async execute(data: CreatePlanDTO): Promise<PlanResponseDTO> {
        const activePlans = await this._planRepository.findAllPaginated({ isActive: true });
        if (activePlans.total >= 3) {
            throw new AppError("Maximum of 3 active plans allowed. Please disable or delete an existing plan to create a new one.", 400);
        }

        const newPlan = PlanEntity.create({
            name: data.name,
            description: data.description,
            price: data.price,
            durationInDays: data.durationInDays,
            features: data.features,
            isActive: true,
            projectLimit: data.projectLimit,
            maxContributors: data.maxContributors,
            participationLimit: data.participationLimit
        });
        const createdPlan = await this._planRepository.create(newPlan);
        return this._planPresentationMapper.toResponseDTO(createdPlan);
    }
}
