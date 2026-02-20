import { PlanEntity } from "../entities/plan.entity";

export interface IPlanRepository {
    create(plan: PlanEntity): Promise<PlanEntity>;
    findById(id: string): Promise<PlanEntity | null>;
    findByName(name: string): Promise<PlanEntity | null>;
    findAll(filter?: { isActive?: boolean }): Promise<PlanEntity[]>;
    update(plan: PlanEntity): Promise<PlanEntity>;
    delete(id: string): Promise<boolean>;
}
