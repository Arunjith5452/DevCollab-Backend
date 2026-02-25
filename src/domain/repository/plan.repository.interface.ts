import { PlanEntity } from "../entities/plan.entity";

import { IBaseRepository } from "./base-repository.interface";

export interface IPlanRepository extends IBaseRepository<PlanEntity> {
    findByName(name: string): Promise<PlanEntity | null>;
    findAllPaginated(filter?: { isActive?: boolean }, page?: number, limit?: number): Promise<{ data: PlanEntity[], total: number }>;
}
