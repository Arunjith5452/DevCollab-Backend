import { injectable, inject } from "inversify";
import { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { PLAN_TYPES } from "@/infrastructure/di/types/plan";
import { PlanPersistenceMapper } from "@/infrastructure/mappers/plan-persistence.mapper";
import { PlanEntity } from "@/domain/entities/plan.entity";
import { IPlanDocument } from "@/infrastructure/db/schema/plan.schema";
import { IPlanRepository } from "@/domain/repository/plan.repository.interface";

@injectable()
export class PlanRepository extends BaseRepository<PlanEntity, IPlanDocument> implements IPlanRepository {
    constructor(
        @inject("PlanModel") model: Model<IPlanDocument>,
        @inject(PLAN_TYPES.PlanPersistenceMapper) mapper: PlanPersistenceMapper
    ) {
        super(model, mapper);
    }

    async findByName(name: string): Promise<PlanEntity | null> {
        const escapedName = name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const found = await this.model.findOne({ name: { $regex: new RegExp(`^${escapedName}$`, 'i') } });
        return found ? this.mapper.fromMongo(found as unknown as IPlanDocument) : null;
    }

    async findAllPaginated(filter?: { isActive?: boolean }, page?: number, limit?: number): Promise<{ data: PlanEntity[], total: number }> {
        const query = filter ? { ...filter } : {};

        let mongoQuery = this.model.find(query);
        const total = await this.model.countDocuments(query);

        if (page && limit) {
            mongoQuery = mongoQuery.skip((page - 1) * limit).limit(limit);
        }

        const plans = await mongoQuery;
        return {
            data: plans.map(p => this.mapper.fromMongo(p as unknown as IPlanDocument)),
            total
        };
    }
}
