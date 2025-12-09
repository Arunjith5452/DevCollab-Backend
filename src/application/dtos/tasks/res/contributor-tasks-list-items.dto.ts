import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";

export class TaskListItemDto {
  id: string;
  title: string;
  description: string;
  assignee: string;
  deadline: string; 
  status: TaskStatus;
  tags: string[];
  payment: number;
  advancePaid: number;
  approval?: "approved" | "improvement-needed";
  feedback?: string;

  constructor(data: {
    id: string;
    title: string;
    assignee: string;
    deadline: Date;
    status: TaskStatus;
    description?: string;
    tags?: string[];
    payment?: number;
    advancePaid?: number;
    feedback?: string;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description || "";
    this.assignee = data.assignee;
    this.deadline = data.deadline.toISOString();
    this.status = data.status;
    this.tags = data.tags || [];
    this.payment = data.payment || 0;
    this.advancePaid = data.advancePaid || 0;
    this.feedback = data.feedback;

    // Auto-detect approval status
    if (data.status === "done") {
      this.approval = data.feedback ? "improvement-needed" : "approved";
    }
  }
}