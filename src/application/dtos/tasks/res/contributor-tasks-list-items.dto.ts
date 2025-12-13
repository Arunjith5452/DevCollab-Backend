import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";

export class TaskListItemDto {
  id: string;
  title: string;
  description: string;
  assignedId: string;
  deadline: string;
  status: TaskStatus;
  tags: string[];
  payment: number;
  advancePaid: number;
  approval?: "approved" | "improvement-needed";
  feedback?: string;
  acceptanceCriteria?: { text: string; completed: boolean }[];

  documents?: string[];
  comments?: { createdAt: Date; message: string; userId: string }[];

  constructor(data: {
    id: string;
    title: string;
    assignedId: string;
    deadline: Date;
    status: TaskStatus;
    description?: string;
    tags?: string[];
    payment?: number;
    advancePaid?: number;
    feedback?: string;
    acceptanceCriteria?: { text: string; completed: boolean }[];

    documents?: string[];
    comments?: { createdAt: Date; message: string; userId: string }[];
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description || "";
    this.assignedId = data.assignedId;
    this.deadline = data.deadline.toISOString();
    this.status = data.status;
    this.tags = data.tags || [];
    this.payment = data.payment || 0;
    this.advancePaid = data.advancePaid || 0;
    this.feedback = data.feedback;
    this.acceptanceCriteria = data.acceptanceCriteria;

    this.documents = data.documents || [];
    this.comments = data.comments;

    // Auto-detect approval status
    if (data.status === "done") {
      this.approval = data.feedback ? "improvement-needed" : "approved";
    }
  }
}