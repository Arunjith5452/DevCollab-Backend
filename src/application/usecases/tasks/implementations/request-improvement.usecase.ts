import { inject, injectable } from "inversify";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { RequestImprovementDTO } from "@/application/dtos/tasks/request-improvement.dto";
import { ITasksRepository } from "@/infrastructure/db/repository/interface/task.interface";
import { TaskEntity } from "@/domain/entities/task.entity";
import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { IProjectRepository } from "@/infrastructure/db/repository/interface/project.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { PROJECT_TYPES } from "@/infrastructure/di/types";

@injectable()
export class RequestImprovementUseCase implements IExecute<RequestImprovementDTO, void> {
    constructor(
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>,
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>
    ) { }

    async execute(data: RequestImprovementDTO): Promise<void> {
        const { taskId, userId, feedback } = data;

        const task = await this._taskRepository.findById(taskId);

        if (!task) {
            throw new Error(ErrorMessage.TASK_NOT_FOUND);
        }

        // Verify user is the project creator
        const project = await this._projectRepository.findEntityById(task.projectId);
        if (!project || project.creatorId !== userId) {
            throw new Error(ErrorMessage.UNAUTHORIZED);
        }

        if (task.status !== "done" || task.approval !== "under-review") {
            throw new Error("Task must be under review to request improvements");
        }

        task.requestImprovement(feedback);

        await this._taskRepository.updateTask(task);
    }
}
