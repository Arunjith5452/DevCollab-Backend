import { injectable } from "inversify";
import { PlanEntity } from "@/domain/entities/plan.entity";
import { PlanResponseDTO } from "@/application/dtos/plans/plan-response.dto";

@injectable()
export class PlanPresentationMapper {
    toResponseDTO(plan: PlanEntity): PlanResponseDTO {
        return {
            id: plan.id || "",
            name: plan.name,
            description: plan.description,
            price: plan.price,
            durationInDays: plan.durationInDays,
            features: plan.features,
            isActive: plan.isActive,
            type: plan.type,
            projectLimit: plan.projectLimit,
            maxContributors: plan.maxContributors,
            participationLimit: plan.participationLimit,
            stripePriceId: plan.stripePriceId
        };
    }

    toResponseDTOs(plans: PlanEntity[]): PlanResponseDTO[] {
        return plans.map(plan => this.toResponseDTO(plan));
    }
}
