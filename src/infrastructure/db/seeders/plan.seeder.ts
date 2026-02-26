import { container } from "@/infrastructure/di/inversify.di";
import { PLAN_TYPES } from "@/infrastructure/di/types/plan";
import { IPlanRepository } from "@/domain/repository/plan.repository.interface";
import { PlanEntity } from "@/domain/entities/plan.entity";
import { PlanFeature } from "@/domain/enums/plan/plan-feature.enum";
import { logger } from "@/infrastructure/providers/logs/logger";

export const seedDefaultFreePlan = async () => {
    try {
        const planRepository = container.get<IPlanRepository>(PLAN_TYPES.PlanRepository);
        const freePlan = await planRepository.findByName("Free");

        if (!freePlan) {
            logger.info("Seeding default Free plan...");
            const newFreePlan = PlanEntity.create({
                name: "Free",
                description: "Basic features for getting started",
                price: 0,
                durationInDays: 36500, // 100 years
                features: [
                    PlanFeature.CREATE_PROJECTS,

                    PlanFeature.JOIN_PROJECTS,
                    PlanFeature.MAX_CONTRIBUTORS
                ],

                projectLimit: 1,
                maxContributors: 4,
                participationLimit: 1,
                isActive: true,
                type: 'one-time'
            });

            await planRepository.create(newFreePlan);
            logger.info("Default Free plan seeded successfully.");
        } else {
            logger.info("Default Free plan already exists.");
        }
    } catch (error) {
        logger.error("Error seeding default Free plan:", error);
    }
};
