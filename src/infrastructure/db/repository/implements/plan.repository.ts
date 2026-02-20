import { injectable, inject } from "inversify";
import { IPlanRepository } from "@/domain/repository/plan.repository.interface";
import { PlanEntity } from "@/domain/entities/plan.entity";
import { PlanModel, IPlanDocument } from "@/infrastructure/db/schema/plan.schema";
import { PLAN_TYPES } from "@/infrastructure/di/types/plan";
import { PlanPersistenceMapper } from "@/infrastructure/mappers/plan-persistence.mapper";

@injectable()
export class PlanRepository implements IPlanRepository {
    constructor(
        @inject(PLAN_TYPES.PlanPersistenceMapper) private _mapper: PlanPersistenceMapper
    ) { }

    async create(plan: PlanEntity): Promise<PlanEntity> {
        const newPlan = new PlanModel(this._mapper.toMongo(plan));
        const saved = await newPlan.save();
        return this._mapper.fromMongo(saved as unknown as IPlanDocument);
    }

    async findById(id: string): Promise<PlanEntity | null> {
        const found = await PlanModel.findById(id);
        return found ? this._mapper.fromMongo(found as unknown as IPlanDocument) : null;
    }

    async findByName(name: string): Promise<PlanEntity | null> {
        const found = await PlanModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        return found ? this._mapper.fromMongo(found as unknown as IPlanDocument) : null;
    }

    async findAll(filter?: { isActive?: boolean }): Promise<PlanEntity[]> {
        const query = filter ? { ...filter } : {};
        const plans = await PlanModel.find(query);
        return plans.map(p => this._mapper.fromMongo(p as unknown as IPlanDocument));
    }

    async update(plan: PlanEntity): Promise<PlanEntity> {
        const mongoData = this._mapper.toMongo(plan);
        // Exclude _id from update data if present, though findByIdAndUpdate ignores it usually
        const { _id, ...updateData } = mongoData as unknown as IPlanDocument;

        const updated = await PlanModel.findByIdAndUpdate(
            plan.id,
            updateData,
            { new: true }
        );
        if (!updated) throw new Error("Plan not found");
        return this._mapper.fromMongo(updated as unknown as IPlanDocument);
    }

    async delete(id: string): Promise<boolean> {
        const deleted = await PlanModel.findByIdAndDelete(id);
        return !!deleted;
    }
}
