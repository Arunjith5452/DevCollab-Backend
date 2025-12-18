import { CreateTaskDTO } from "@/application/dtos/tasks/create-task.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { TaskEntity } from "@/domain/entities/task.entity";
import { ITasksRepository } from "@/infrastructure/db/repository/interface/task.interface";
import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
import { inject, injectable } from "inversify";

@injectable()
export class CreateTaskUseCase implements IExecute<CreateTaskDTO, void> {
    constructor(
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>
    ) { }

    async execute(dto: CreateTaskDTO): Promise<void> {
        try {

            const task = TaskEntity.create({
                title: dto.title.trim(),
                projectId: dto.projectId,
                assignedId: dto.assignedId,
                description: dto.description,
                status: dto.status || "todo",
                deadline: new Date(dto.deadline),
                tags: dto.tags || [],
                documents: dto.documents || [],
                acceptanceCriteria: dto.acceptanceCriteria,
                payment: dto.payment
                    ? {
                        amount: dto.payment.amount,
                        advancePaid: dto.payment.advancePaid,
                    }
                    : undefined,
            });
            console.log("after create usecase", task)

            await this._taskRepository.createTask(task)
        } catch (error) {
            throw error;
        }
    }
}