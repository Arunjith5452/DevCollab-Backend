
import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";
import { ApprovalStatus } from "@/domain/enums/tasks/approval-status.enum";

export interface AcceptanceCriteriaDto {
  text: string;
  completed: boolean;
}

export class TaskListItemDto {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedId: string;
  deadline: string | null;
  tags: string[];
  payment: number;
  advancePaid: number;
  acceptanceCriteria: AcceptanceCriteriaDto[];
  documents: string[];
  comments: { createdAt: Date; message: string; userId: string }[];
  prLink?: string;
  workDescription?: string;
  approval?: ApprovalStatus;  
  feedback?: string;        

  constructor(data: {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    assignedId: string;
    deadline: Date | null;
    tags?: string[];
    payment?: number;
    advancePaid?: number;
    acceptanceCriteria?: AcceptanceCriteriaDto[];
    documents?: string[];
    comments?: { createdAt: Date; message: string; userId: string }[];
    prLink?: string;
    workDescription?: string;
    approval?: ApprovalStatus;
    feedback?: string;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description ?? "";
    this.status = data.status;
    this.assignedId = data.assignedId;
    this.deadline = data.deadline ? new Date(data.deadline).toISOString() : null;
    this.tags = data.tags ?? [];
    this.payment = data.payment ?? 0;
    this.advancePaid = data.advancePaid ?? 0;
    this.acceptanceCriteria = data.acceptanceCriteria ?? [];
    this.documents = data.documents ?? [];
    this.comments = data.comments ?? [];
    this.prLink = data.prLink;
    this.workDescription = data.workDescription;
    this.approval = data.approval;
    this.feedback = data.feedback;
  }
}