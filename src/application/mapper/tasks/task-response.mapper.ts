
import { TaskListItemDto } from "@/application/dtos/tasks/res/list-task.dto";

export interface LeanTask {
    id?: string;
    _id?: { toString(): string };
    title: string;
    description: string;
    status: string;
    assignedId: string;
    deadline?: Date;
    tags?: string[];
    payment?: { amount: number; advancePaid: number };
    acceptanceCriteria?: Array<{
        text: string;
        completed?: boolean;
    }>;
    documents?: string[];
}

export class TaskResponseMapper {
    static toListItem(raw: LeanTask): TaskListItemDto {
        return {
            id: (raw.id || raw._id?.toString()) ?? '',
            title: raw.title,
            description: raw.description,
            status: raw.status,
            assignedId: raw.assignedId,
            deadline: raw.deadline?.toISOString() ?? null,
            tags: raw.tags ?? [],
            payment: raw.payment?.amount ?? 0,
            advancePaid: raw.payment?.advancePaid ?? 0,
            acceptanceCriteria: raw.acceptanceCriteria?.map(item => ({
                text: item.text,
                completed: item.completed ?? false,
            })) ?? [],
            documents: raw.documents ?? [],
        };
    }

    static toListItemArray(list: LeanTask[]): TaskListItemDto[] {
        return list.map(this.toListItem);
    }
}