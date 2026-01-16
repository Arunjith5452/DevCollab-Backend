import { inject, injectable } from "inversify";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ITasksRepository } from "@/infrastructure/db/repository/interface/task.interface";
import { TaskEntity } from "@/domain/entities/task.entity";
import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { IProjectRepository } from "@/infrastructure/db/repository/interface/project.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";
import { ApprovalStatus } from "@/domain/enums/tasks/approval-status.enum";

@injectable()
export class ApproveTaskUseCase implements IExecute<{ userId: string, taskId: string }, void> {
    constructor(
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>,
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>
    ) { }

    async execute({ userId, taskId }: { userId: string, taskId: string }): Promise<void> {

        const task = await this._taskRepository.findById(taskId);

        if (!task) {
            throw new Error(ErrorMessage.TASK_NOT_FOUND);
        }

        const project = await this._projectRepository.findEntityById(task.projectId);
        if (!project || project.creatorId !== userId) {
            throw new Error(ErrorMessage.UNAUTHORIZED);
        }

        if (task.status !== TaskStatus.DONE || task.approval !== ApprovalStatus.UNDER_REVIEW) {
            throw new Error("Task must be under review to approve");
        }

        task.approve();
        console.log("Task approved, new state:", JSON.stringify(task));

        await this._taskRepository.updateTask(task);
    }
}
