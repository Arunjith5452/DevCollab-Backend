import { PlanFeature } from "@/domain/enums/plan/plan-feature.enum";

export interface PlanResponseDTO {
    id: string;
    name: string;
    description: string;
    price: number;
    durationInDays: number;
    features: PlanFeature[];

    isActive: boolean;
    type: 'one-time';
    projectLimit: number;
    maxContributors: number;
    participationLimit: number;
    stripePriceId?: string;
}
