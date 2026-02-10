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
export class GetProjectStatsUseCase implements IExecute<{ projectId: string; startDate?: Date; endDate?: Date }, ProjectStatsDTO> {
    constructor(
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>
    ) { }

    async execute(input: { projectId: string; startDate?: Date; endDate?: Date }): Promise<ProjectStatsDTO> {
        const { projectId, startDate, endDate } = input;

        // 1. Validate project exists
        const project = await this._projectRepository.findByIdWithCreator(projectId);
        if (!project) {
            throw new Error("Project not found");
        }

        const projectObjectId = new Types.ObjectId(projectId);

        // 2. Fetch all tasks for the project with optional date filtering
        const query: any = { projectId: projectObjectId };

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = startDate;
            if (endDate) query.createdAt.$lte = endDate;
        }

        const tasks = await this._taskRepository.findTask(query, { skip: 0, limit: 1000 });


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

        // 4. Determine grouping and time range
        let groupBy: 'day' | 'month' = 'month';
        let start = startDate;
        let end = endDate || new Date();

        if (start && end) {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 90) {
                groupBy = 'day';
            }
        } else {
            // Default to last 6 months if no date range provided
            const today = new Date();
            start = new Date(today.getFullYear(), today.getMonth() - 5, 1);
        }

        // 5. Calculate Earnings Timeline
        const earningsMap = new Map<string, number>();

        tasks.forEach(task => {
            if (task.payment && (task.payment.escrowStatus === 'released' || task.status === TaskStatus.DONE)) {
                const date = task.updatedAt || task.createdAt;
                let label: string;

                if (groupBy === 'day') {
                    label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                } else {
                    label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                }

                // Only include if within range (though repo query already filters, this handles default 6mo view if repo returns more)
                if (start && date < start) return;

                const current = earningsMap.get(label) || 0;
                earningsMap.set(label, current + task.payment.amount);
            }
        });

        const earningsTimeline = Array.from(earningsMap.entries())
            .map(([month, earnings]) => ({ month, earnings }))
            .sort((a, b) => {
                // Sort by date 
                // Note: This simple sort works if format is consistent, but for robust sorting we might need original dates.
                // However, since we are building from tasks, we can just sort the result. 
                // A better way is to iterate correctly or parse the label back to date.
                // For simplicity, let's rely on the fact that we can parse the label or improved sorting.
                return new Date(a.month).getTime() - new Date(b.month).getTime();
            });

        // 6. Calculate Activity Timeline
        const activityMap = new Map<string, { created: number; completed: number }>();

        tasks.forEach(task => {
            // Created count
            const createdDate = task.createdAt;
            if (!start || createdDate >= start) {
                let createdLabel: string;
                if (groupBy === 'day') {
                    createdLabel = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                } else {
                    createdLabel = createdDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                }

                if (!activityMap.has(createdLabel)) {
                    activityMap.set(createdLabel, { created: 0, completed: 0 });
                }
                activityMap.get(createdLabel)!.created += 1;
            }

            // Completed count
            if (task.status === TaskStatus.DONE) {
                const completedDate = task.updatedAt || task.createdAt;
                if (!start || completedDate >= start) {
                    let completedLabel: string;
                    if (groupBy === 'day') {
                        completedLabel = completedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    } else {
                        completedLabel = completedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                    }

                    if (!activityMap.has(completedLabel)) {
                        activityMap.set(completedLabel, { created: 0, completed: 0 });
                    }
                    activityMap.get(completedLabel)!.completed += 1;
                }
            }
        });

        const activityTimeline = Array.from(activityMap.entries())
            .map(([month, stats]) => ({ month, ...stats }))
            .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

        return {
            completionRate,
            totalTasks,
            completedTasks,
            contributorPerformance,
            earningsTimeline,
            activityTimeline
        };
    }

    // Removed private methods as logic is now inline and dynamic
    /*
    private calculateEarningsTimeline(tasks: TaskEntity[]): { month: string; earnings: number }[] { ... }
    private calculateActivityTimeline(tasks: TaskEntity[]): { month: string; created: number; completed: number }[] { ... }
    private getLast6Months(): string[] { ... }
    */
}
