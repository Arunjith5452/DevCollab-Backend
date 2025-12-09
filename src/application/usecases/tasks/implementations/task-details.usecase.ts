// import { IExecute } from "@/application/interface/execute.usecase.interface";
// import { TaskEntity } from "@/domain/entities/task.entity";
// import { ITasksRepository } from "@/infrastructure/db/repository/interface/task.interface";
// import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
// import { inject, injectable } from "inversify";

// injectable()
// export class TaskDetailsUseCase implements IExecute<void, void> {

//     constructor(
//         @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>
//     ) { }

//     async execute(projectId: string ): Promise<void> {

//         try {



//         } catch (error) {
//             throw error
//         }

//     }

// }