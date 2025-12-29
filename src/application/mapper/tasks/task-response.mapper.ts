
import { TaskListItemDto } from "@/application/dtos/tasks/res/list-task.dto";
import { TaskEntity } from "@/domain/entities/task.entity";
import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";

export class TaskResponseMapper {
    static toListItem(entity: TaskEntity): TaskListItemDto {
        if (!entity.id) {
            console.log('entity.id', entity.id)
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
            advancePaid: entity.payment.advancePaid,
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