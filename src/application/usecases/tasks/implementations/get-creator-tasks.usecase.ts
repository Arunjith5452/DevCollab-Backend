import { injectable, inject } from 'inversify';
import { IExecute } from '@/application/interface/execute.usecase.interface';
import { ITasksRepository } from '@/infrastructure/db/repository/interface/task.interface';
import { TASK_TYPES } from '@/infrastructure/di/types/tasks';
import { GetAllTaskQuery } from '../interface/task-usecase.interface';
import { SuccessMessage } from '@/domain/enums/messages/success-message.enum';
import { TaskResponseMapper } from '@/application/mapper/tasks/task-response.mapper';
import { TaskListItemDto } from '@/application/dtos/tasks/res/list-task.dto';
import { Types } from 'mongoose';

@injectable()
export class GetCreatorTasksUseCase implements IExecute<GetAllTaskQuery, { message: string; tasks: TaskListItemDto[]; total: number }> {
    constructor(
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<any>,
    ) { }

    async execute(query: GetAllTaskQuery,): Promise<{ message: string; tasks: TaskListItemDto[]; total: number }> {

        const { projectId, search, assignee, status, page = 1, limit = 10 } = query;

        if (!projectId) {
            throw new Error('projectId is required to fetch tasks');
        }

        const filter: Record<string, unknown> = {
            projectId: new Types.ObjectId(projectId),
        };

        if (search?.trim()) {
            const regex = { $regex: search.trim(), $options: 'i' };
            filter.$or = [
                { title: regex },
                { description: regex },
                { assignedId: regex },
            ];
        }
        if (assignee && assignee !== 'all') {
            filter.assignedId = assignee;
        }
        if (status && status !== 'all') {
            filter.status = status;
        }

        const skip = (page - 1) * limit;

        const [tasks, total] = await Promise.all([this._taskRepository.findTask(filter, { skip, limit }), this._taskRepository.count(filter)]);

        const tasksDto = TaskResponseMapper.toList(tasks);
        console.log("taskdDto", tasksDto)

        return {
            message: SuccessMessage.TASK_FETCHED,
            tasks: tasksDto,
            total,
        };
    }
}