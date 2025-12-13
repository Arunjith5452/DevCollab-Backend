import { AddCommentDTO } from "@/application/dtos/tasks/add-comment.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { TaskEntity } from "@/domain/entities/task.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { ITasksRepository } from "@/infrastructure/db/repository/interface/task.interface";
import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
import { inject, injectable } from "inversify";

@injectable()
export class AddCommentUseCase implements IExecute<AddCommentDTO, void> {
    constructor(
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>
    ) { }

    async execute(data: AddCommentDTO): Promise<void> {
        try {
            const task = await this._taskRepository.findById(data.taskId);

            if (!task) {
                throw new Error(ErrorMessage.TASK_NOT_FOUND);
            }

            task.addComment({ message: data.message, userId: data.userId });

            await this._taskRepository.updateTask(task);

        } catch (error) {
            throw error;
        }
    }
}
