import { GetContributorTasksQuery } from "@/application/dtos/tasks/get-contributor-tasks.dto";
import { TaskListItemDto } from "@/application/dtos/tasks/res/list-task.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { TaskResponseMapper } from "@/application/mapper/tasks/task-response.mapper";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { TaskEntity } from "@/domain/entities/task.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { ITasksRepository } from "@/domain/repository/task.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
import { inject, injectable } from "inversify";


@injectable()
export class GetContributorTaskUseCase implements IExecute<GetContributorTasksQuery, TaskListItemDto[]> {

    constructor(
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>,
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>
    ) { }

    async execute(query: GetContributorTasksQuery): Promise<TaskListItemDto[]> {

        try {

            const { projectId, userId, status } = query

            const project = await this._projectRepository.findEntityById(projectId)

            if (!project?.members.some(m => m.userId === userId && m.status === "active")) {
                throw new Error(ErrorMessage.UNAUTHORIZED);
            }

            let tasks: TaskEntity[]

            if (status === TaskStatus.TODO) {
                tasks = await this._taskRepository.findByProjectAndStatus(projectId, "todo")
            } else {
                tasks = await this._taskRepository.findByProjectStatusAndAssignee(projectId, status, userId)
            }

            return TaskResponseMapper.toList(tasks)

        } catch (error) {
            throw error
        }

    }
}
