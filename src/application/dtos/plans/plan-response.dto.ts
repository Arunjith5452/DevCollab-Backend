export interface PlanResponseDTO {
    id: string;
    name: string;
    description: string;
    price: number;
    durationInDays: number;
    features: string[];
    isActive: boolean;
    type: 'one-time';
    projectLimit: number;
    maxContributors: number;
    participationLimit: number;
    stripePriceId?: string;
}
