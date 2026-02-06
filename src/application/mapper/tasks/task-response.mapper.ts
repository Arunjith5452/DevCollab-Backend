
import { TaskListItemDto } from "@/application/dtos/tasks/res/list-task.dto";
import { TaskEntity } from "@/domain/entities/task.entity";
import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";

import { injectable } from "inversify";
import { CreateTaskResponseDTO } from "@/application/dtos/tasks/res/create-task-response.dto";

@injectable()
export class TaskResponseMapper {
    toResponse(task: TaskEntity): CreateTaskResponseDTO {
        return new CreateTaskResponseDTO({
            id: task.id!,
            title: task.title,
            description: task.description,
            projectId: task.projectId,
            assignedId: task.assignedId,
            status: task.status,
            deadline: task.deadline,
            tags: task.tags,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
        });
    }

    static toListItem(entity: TaskEntity): TaskListItemDto {
        if (!entity.id) {
            throw new Error("TaskEntity ID is missing");
        }
        return new TaskListItemDto({
            id: entity.id,
            title: entity.title,
            description: entity.description,
            status: entity.status as TaskStatus,
            assignedId: entity.assignedId,
            deadline: entity.deadline,
            tags: entity.tags,
            payment: entity.payment.amount,
            acceptanceCriteria: entity.acceptanceCriteria,
            documents: entity.documents ?? [],
            comments: entity.comments ?? [],
            prLink: entity.prLink,
            workDescription: entity.workDescription,
            approval: entity.approval,
            feedback: entity.feedBack,
            escrowStatus: entity.payment.escrowStatus,
        });
    }

    static toList(entities: TaskEntity[]): TaskListItemDto[] {
        return entities.map(this.toListItem);
    }
}