import { TaskEntity } from "@/domain/entities/task.entity";
import { ITask } from "../db/interface/task.interface";
import { ApprovalStatus } from "@/domain/enums/tasks/approval-status.enum";
import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";
import { Types } from "mongoose";

import { IPersistenceMapper } from "./interface/persistence-mapper.interface";

export class TaskPersistenceMapper implements IPersistenceMapper<TaskEntity, ITask> {

    toMongo(task: TaskEntity) {
        return {
            title: task.title,
            projectId: new Types.ObjectId(task.projectId) as unknown as Types.ObjectId,
            assignedId: new Types.ObjectId(task.assignedId) as unknown as Types.ObjectId,
            description: task.description,
            prLink: task.prLink,
            feedBack: task.feedBack,
            approval: task.approval,
            workDescription: task.workDescription,
            status: task.status as TaskStatus,
            deadline: task.deadline,
            comments: task.comments?.map(c => ({
                message: c.message,
                userId: new Types.ObjectId(c.userId),
                createdAt: c.createdAt
            })) as unknown as ITask['comments'],
            tags: task.tags,
            acceptanceCriteria: task.acceptanceCriteria as unknown as ITask['acceptanceCriteria'],
            payment: {
                totalAmount: task.payment?.amount || 0,
                escrowStatus: task.payment?.escrowStatus || "not-paid"
            },
            documents: task.documents || []
        }
    }


    fromMongo(doc: ITask & { _id: Types.ObjectId }): TaskEntity {
        return TaskEntity.create({
            id: doc._id.toString(),
            title: doc.title,
            projectId: doc.projectId.toString(),
            assignedId: doc.assignedId?.toString() ?? undefined,
            description: doc.description ?? "",
            prLink: doc.prLink ?? undefined,
            approval: doc.approval ? doc.approval as ApprovalStatus : undefined,
            workDescription: doc.workDescription ?? undefined,
            feedBack: doc.feedBack ?? undefined,
            status: doc.status,
            deadline: doc.deadline ? new Date(doc.deadline) : new Date(),
            comments: doc.comments?.map((c) => ({
                message: c.message ?? "",
                userId: String((c.userId as { _id?: unknown })?._id || c.userId || ""),
                createdAt: c.createdAt
            })) ?? undefined,
            tags: doc.tags ?? undefined,
            acceptanceCriteria: doc.acceptanceCriteria ?? undefined,
            payment: doc.payment ? {
                amount: doc.payment.totalAmount,
                escrowStatus: doc.payment.escrowStatus
            } : undefined,
            documents: doc.documents ?? undefined,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }
}
