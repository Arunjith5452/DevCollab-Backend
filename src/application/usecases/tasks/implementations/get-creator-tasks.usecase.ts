import { injectable, inject } from 'inversify';
import { IExecute } from '@/application/interface/execute.usecase.interface';
import { ITasksRepository } from '@/infrastructure/db/repository/interface/task.interface';
import { TASK_TYPES } from '@/infrastructure/di/types/tasks';
import { GetAllTaskQuery } from '../interface/task-usecase.interface';
import { SuccessMessage } from '@/domain/enums/messages/success-message.enum';
import { TaskResponseMapper } from '@/application/mapper/tasks/task-response.mapper';
import { TaskListItemDto } from '@/application/dtos/tasks/res/list-task.dto';
import { Types } from 'mongoose';
import { IProjectRepository } from '@/infrastructure/db/repository/interface/project.interface';
import { PROJECT_TYPES } from '@/infrastructure/di/types/project';
import { TaskEntity } from '@/domain/entities/task.entity';
import { ProjectEntity } from '@/domain/entities/project.entity';

@injectable()
export class GetCreatorTasksUseCase implements IExecute<GetAllTaskQuery, { message: string; tasks: TaskListItemDto[]; total: number }> {
    constructor(
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>,
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
    ) { }

    async execute(query: GetAllTaskQuery,): Promise<{ message: string; tasks: TaskListItemDto[]; total: number }> {

        const { projectId, search, assignee, status, page = 1, limit = 10 } = query;

        if (!projectId) {
            throw new Error('projectId is required to fetch tasks');
        }

        const filter: Record<string, any> = {
            projectId: new Types.ObjectId(projectId),
        };

        if (search?.trim()) {
            const regex = { $regex: search.trim(), $options: 'i' };

            const members = await this._projectRepository.getProjectMembersForAssignee(projectId);
            const matchingMemberIds = members
                .filter(m => m.name.toLowerCase().includes(search.trim().toLowerCase()))
                .map(m => m.userId);

            const searchAsId = search.trim();
            const validIds = [...matchingMemberIds];

            if (Types.ObjectId.isValid(searchAsId)) {
                validIds.push(searchAsId);
            }

            filter.$or = [
                { title: regex },
                { description: regex },
            ];

            if (validIds.length > 0) {
                // Explicitly cast strings to ObjectId if they are strings, though Mongoose might handle string->ObjectId in $in automatically if valid.
                // But manual cast is safer to avoid CastParam issues if any weirdness.
                // matchingMemberIds are likely ObjectIds already. searchAsId is string.
                // Let's just pass them. If Types.ObjectId.isValid is true, it's safe.
                filter.$or.push({ assignedId: { $in: validIds } });
            }
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