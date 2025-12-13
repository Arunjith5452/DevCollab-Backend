import { inject, injectable } from "inversify";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { SubmitWorkDTO } from "@/application/dtos/tasks/submit-work.dto";
import { ITasksRepository } from "@/infrastructure/db/repository/interface/task.interface";
import { TaskEntity } from "@/domain/entities/task.entity";
import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";

@injectable()
export class SubmitWorkUseCase implements IExecute<SubmitWorkDTO, void> {
    constructor(
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>
    ) { }

    async execute(data: SubmitWorkDTO): Promise<void> {
        const { taskId, userId, prLink, workDescription } = data;

        const task = await this._taskRepository.findById(taskId);

        if (!task) {
            throw new Error(ErrorMessage.TASK_NOT_FOUND);
        }

        if (task.assignedId !== userId) {
            throw new Error(ErrorMessage.UNAUTHORIZED);
        }

        if (task.status !== "in-progress") {
            throw new Error("Task must be in progress to submit work");
        }

        task.submitWork(prLink, workDescription);

        await this._taskRepository.updateTask(task);
    }
}
