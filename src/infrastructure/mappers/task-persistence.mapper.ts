import { TaskEntity } from "@/domain/entities/task.entity";

export class TaskPersistenceMapper {

    toMongo(task: TaskEntity) {
        return {
            title: task.title,
            projectId: task.projectId,
            assignedTo: task.assignedTo,
            description: task.description,
            prLink: task.prLink,
            feedBack: task.feedBack,
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
                advancePaid: task.payment?.advancePaid,
                amount: task.payment?.amount
            },
            documents: task.documents
        }
    }

    async fromMongo(doc: any): Promise<TaskEntity> {
        return TaskEntity.create({
            id: doc._id,
            title: doc.title,
            projectId: doc.projectId,
            assignedTo: doc.assignedTo,
            description: doc.description,
            prLink: doc.prLink,
            feedBack: doc.feedBack,
            status: doc.status,
            deadline: doc.deadline,
            comments: doc.comments?.map((c: any) => ({
                message: c.message,
                userId: typeof c.userId === "string" ? c.userId : c.userId?._id,
                createdAt: c.createdAt
            })),
            tags: doc.tags,
            acceptanceCriteria: doc.acceptanceCriteria,
            payment: doc.payment,
            documents: doc.documents,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }

}
