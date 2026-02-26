import { IExecute } from "@/application/interface/execute.usecase.interface";
import { TaskEntity } from "@/domain/entities/task.entity";
import { ITasksRepository } from "@/domain/repository/task.interface";
import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
import { inject, injectable } from "inversify";
import { UpdateTaskCriteriaDTO } from "@/application/dtos/tasks/update-task-criteria.dto";

@injectable()
export class UpdateTaskCriteriaUseCase implements IExecute<{ taskId: string, dto: UpdateTaskCriteriaDTO }, TaskEntity | null> {

    constructor(
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>
    ) { }

    async execute({ taskId, dto }: { taskId: string, dto: UpdateTaskCriteriaDTO }): Promise<TaskEntity | null> {
        try {
            const task = await this._taskRepository.findById(taskId);

            if (!task) {
                throw new Error("Task not found");
            }

            task.updateAcceptanceCriteria(dto.acceptanceCriteria);

            const updatedTask = await this._taskRepository.updateTask(task);

            return updatedTask;

        } catch (error) {
            throw error;
        }
    }
}
