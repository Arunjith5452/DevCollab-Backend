import { StartTaskDTO } from "@/application/dtos/tasks/start-task.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { TaskEntity } from "@/domain/entities/task.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";
import { ITasksRepository } from "@/infrastructure/db/repository/interface/task.interface";
import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
import { inject, injectable } from "inversify";

@injectable()
export class StartTaskUseCase implements IExecute<StartTaskDTO, void> {
    constructor(
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>
    ) { }

    async execute(data: StartTaskDTO): Promise<void> {
        const { taskId, userId } = data;

        const task = await this._taskRepository.findById(taskId);

        if (!task) {
            throw new Error(ErrorMessage.TASK_NOT_FOUND )
        }

        console.log("StartTask Debug:", {
            reqUserId: userId,
            reqUserIdType: typeof userId,
            taskAssignedId: task.assignedId,
            taskAssignedIdType: typeof task.assignedId,
            isMatch: task.assignedId == userId
        });

        if (task.assignedId.toString() !== userId.toString()) {
            throw new Error(ErrorMessage.UNAUTHORIZED);
        }

        if (task.status !== TaskStatus.TODO) {
            throw new Error("Task cannot be started. Invalid status.");
        }

        task.updateStatus(TaskStatus.IN_PROGRESS);

        await this._taskRepository.updateTask(task);
    }
}
