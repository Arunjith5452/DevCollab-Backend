import { TaskListItemDto } from "@/application/dtos/tasks/res/contributor-tasks-list-items.dto";
import { TaskEntity } from "@/domain/entities/task.entity";
import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";

export class ContributorTaskMapper {
    private constructor() { }

    static toListItem(entity: TaskEntity): TaskListItemDto {

        return new TaskListItemDto({
            id: entity.id!,
            title: entity.title,
            assignee: entity.assignedTo,
            deadline: entity.deadline,
            status: entity.status as TaskStatus,
            description: entity.description,
            tags: entity.tags,
            payment: entity.payment.amount,
            advancePaid: entity.payment.advancePaid,
            feedback: entity.feedBack,
        });
    }

    static toList(entities: TaskEntity[]): TaskListItemDto[] {
    
        return entities.map(this.toListItem);
    }
}