import { ProjectStatsDTO } from "@/application/dtos/project/res/project-stats.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { TaskEntity } from "@/domain/entities/task.entity";
import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { ITasksRepository } from "@/domain/repository/task.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";

@injectable()
export class GetProjectStatsUseCase implements IExecute<string, ProjectStatsDTO> {
    constructor(
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>
    ) { }

    async execute(projectId: string): Promise<ProjectStatsDTO> {
        // 1. Validate project exists
        const project = await this._projectRepository.findByIdWithCreator(projectId);
        if (!project) {
            throw new Error("Project not found");
        }

        const projectObjectId = new Types.ObjectId(projectId);

        // 2. Fetch all tasks for the project
        const tasks = await this._taskRepository.findTask({ projectId: projectObjectId }, { skip: 0, limit: 1000 }); // Assuming limit 1000 is enough for stats, or we should use aggregate if possible but repository might not expose it. 
        // Better approach using count if available efficiently, but we need details for contributor stats.
        // If findTask returns generic T[], we assume it returns TaskEntity[] or similar structure that we can map.
        // The repository interface says Promise<T[]>. TaskEntity has assignedId and status.

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // 3. Calculate contributor performance
        const memberStats = new Map<string, { name: string, completed: number, total: number }>();

        // Initialize for all members
        project.members.forEach(member => {
            if (member.user) {
                memberStats.set(member.userId.toString(), {
                    name: member.user.name,
                    completed: 0,
                    total: 0
                });
            }
        });

        // Tally tasks
        tasks.forEach(task => {
            if (task.assignedId) {
                const stats = memberStats.get(task.assignedId.toString());
                if (stats) {
                    stats.total += 1;
                    if (task.status === TaskStatus.DONE) {
                        stats.completed += 1;
                    }
                }
            }
        });

        const contributorPerformance = Array.from(memberStats.entries()).map(([userId, stats]) => ({
            userId,
            name: stats.name,
            completedTasks: stats.completed,
            totalAssigned: stats.total
        }));

        return {
            completionRate,
            totalTasks,
            completedTasks,
            contributorPerformance
        };
    }
}
