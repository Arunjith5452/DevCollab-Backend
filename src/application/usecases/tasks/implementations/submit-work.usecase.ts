import { inject, injectable } from "inversify";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { SubmitWorkDTO } from "@/application/dtos/tasks/submit-work.dto";
import { ITasksRepository } from "@/domain/repository/task.interface";
import { TaskEntity } from "@/domain/entities/task.entity";
import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";

@injectable()
export class SubmitWorkUseCase implements IExecute<{ userId: string, taskId: string, data: SubmitWorkDTO }, void> {
    constructor(
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>
    ) { }

    async execute({ userId, taskId, data }: { userId: string, taskId: string, data: SubmitWorkDTO }): Promise<void> {

        try {

            const { prLink, workDescription } = data;

            const task = await this._taskRepository.findById(taskId)

            if (!task) {
                throw new Error(ErrorMessage.TASK_NOT_FOUND);
            }

            if (task.assignedId.toString() !== userId) {
                throw new Error(ErrorMessage.UNAUTHORIZED);
            }

            if (task.status !== TaskStatus.IN_PROGRESS) {
                throw new Error("Task must be in progress to submit work");
            }

            const incompleteCriteria = task.acceptanceCriteria.filter(c => !c.completed);
            if (incompleteCriteria.length > 0) {
                throw new Error("All acceptance criteria must be completed before submitting work");
            }

            task.submitWork(prLink, workDescription);

            await this._taskRepository.updateTask(task);


        } catch (error) {
            throw error
        }
    }
}
