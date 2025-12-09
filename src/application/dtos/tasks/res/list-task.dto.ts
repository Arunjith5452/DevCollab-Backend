
export interface AcceptanceCriteriaDto {
    text: string;
    completed: boolean;
}

export interface TaskListItemDto {
    id: string;
    title: string;
    description: string;
    status: string;
    assignedTo: string;
    deadline: string | null;
    tags: string[];
    payment: number;
    advancePaid: number;
    acceptanceCriteria: AcceptanceCriteriaDto[];
    documents?: string[]
}