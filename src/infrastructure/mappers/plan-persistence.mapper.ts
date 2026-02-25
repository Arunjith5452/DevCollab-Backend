import { PlanEntity } from "@/domain/entities/plan.entity";
import { IPersistenceMapper } from "@/infrastructure/mappers/interface/persistence-mapper.interface";
import { injectable } from "inversify";
import { IPlanDocument } from "@/infrastructure/db/schema/plan.schema";

@injectable()
export class PlanPersistenceMapper implements IPersistenceMapper<PlanEntity, IPlanDocument> {
    toMongo(entity: PlanEntity): IPlanDocument {
        return {
            _id: entity.id,
            name: entity.name,
            description: entity.description,
            price: entity.price,
            durationInDays: entity.durationInDays,
            features: entity.features,
            isActive: entity.isActive,
            type: entity.type,
            projectLimit: entity.projectLimit,
            maxContributors: entity.maxContributors,
            participationLimit: entity.participationLimit,
            stripePriceId: entity.stripePriceId
        } as unknown as IPlanDocument;
    }

    fromMongo(doc: IPlanDocument): PlanEntity {
        return PlanEntity.create({
            id: doc._id.toString(),
            name: doc.name,
            description: doc.description,
            price: doc.price,
            durationInDays: doc.durationInDays,
            features: doc.features,
            isActive: doc.isActive,
            type: doc.type,
            projectLimit: doc.projectLimit,
            maxContributors: doc.maxContributors,
            participationLimit: doc.participationLimit,
            stripePriceId: doc.stripePriceId
        });
    }
}
