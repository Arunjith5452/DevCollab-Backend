import { TaskEntity } from "@/domain/entities/task.entity";

export class TaskPersistenceMapper {

    toMongo(task: TaskEntity) {
        return {
            title: task.title,
            projectId: task.projectId,
            assignedId: task.assignedId,
            description: task.description,
            prLink: task.prLink,
            feedBack: task.feedBack,
            approval: task.approval,
            workDescription: task.workDescription,
            status: task.status,
            deadline: task.deadline,
            comments: task.comments?.map(c => ({
                message: c.message,
                userId: c.userId,
                createdAt: c.createdAt
            })),
            tags: task.tags,
            acceptanceCriteria: task.acceptanceCriteria,
            payment: {
                totalAmount: task.payment?.amount, // Map amount to totalAmount for Mongoose
                escrowStatus: task.payment?.escrowStatus // Persist escrow status
            },
            documents: task.documents
        }
    }

    async fromMongo(doc: any): Promise<TaskEntity> {
        return TaskEntity.create({
            id: doc._id.toString(),
            title: doc.title,
            projectId: doc.projectId.toString(),
            assignedId: doc.assignedId,
            description: doc.description,
            prLink: doc.prLink,
            approval: doc.approval,
            workDescription: doc.workDescription,
            feedBack: doc.feedBack,
            status: doc.status,
            deadline: doc.deadline,
            comments: doc.comments?.map((c: any) => ({
                message: c.message,
                userId: c.userId?._id?.toString() || c.userId,
                createdAt: c.createdAt
            })),
            tags: doc.tags,
            acceptanceCriteria: doc.acceptanceCriteria,
            payment: doc.payment ? {
                amount: doc.payment.totalAmount, // Map totalAmount back to amount for Entity
                escrowStatus: doc.payment.escrowStatus
            } : undefined,
            documents: doc.documents,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }
}
