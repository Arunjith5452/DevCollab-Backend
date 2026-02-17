import { ContributorStatsDTO, TaskBreakdownItem, EarningsTimelineItem } from "@/application/dtos/project/res/contributor-stats.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { TaskEntity } from "@/domain/entities/task.entity";
import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";
import { IProjectRepository } from "@/domain/repository/project.interface";
import { ITasksRepository } from "@/domain/repository/task.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { TASK_TYPES } from "@/infrastructure/di/types/tasks";
import { inject, injectable } from "inversify";
import { FilterQuery } from "mongoose";

interface GetContributorStatsQuery {
    projectId: string;
    userId: string;
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
}

@injectable()
export class GetContributorStatsUseCase implements IExecute<GetContributorStatsQuery, ContributorStatsDTO> {
    constructor(
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>,
        @inject(TASK_TYPES.TaskRepository) private readonly _taskRepository: ITasksRepository<TaskEntity>
    ) { }

    async execute(query: GetContributorStatsQuery): Promise<ContributorStatsDTO> {

        const { projectId, userId } = query;

        const project = await this._projectRepository.findByIdWithCreator(projectId);
        if (!project) {
            throw new Error("Project not found");
        }

        const isMember = project.members.some(m => m.userId === userId && m.status === "active");
        if (!isMember) {
            throw new Error("User is not a member of this project");
        }

        // 2. Fetch all tasks assigned to the contributor in this project
        const queryFilter: FilterQuery<TaskEntity> = {
            projectId: projectId,
            assignedId: userId
        };

        if (query.startDate || query.endDate) {
            const dateQuery: { $gte?: Date; $lte?: Date } = {};
            if (query.startDate) dateQuery.$gte = query.startDate;
            if (query.endDate) dateQuery.$lte = query.endDate;
            // Use Object.defineProperty or cast to any to bypass readonly check on createdAt
            // or simply recreate the object
            Object.assign(queryFilter, { createdAt: dateQuery });
        }

        const tasks = await this._taskRepository.findTask(
            queryFilter,
            { skip: 0, limit: 1000 }
        );

        // 3. Calculate earnings
        let totalEarnings = 0;
        let paidEarnings = 0;
        let pendingEarnings = 0;

        tasks.forEach(task => {
            const amount = task.payment?.amount || 0;
            totalEarnings += amount;

            if (task.payment?.escrowStatus === "released") {
                paidEarnings += amount;
            } else {
                pendingEarnings += amount;
            }
        });

        // 4. Calculate task statistics
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
        const pendingTasks = totalTasks - completedTasks;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // 5. Generate task breakdown
        const allTaskBreakdown: TaskBreakdownItem[] = tasks.map(task => ({
            taskId: task.id || "",
            title: task.title,
            amount: task.payment?.amount || 0,
            creatorName: project.creator?.name || "Unknown",
            createdAt: task.createdAt,
            status: task.status,
            paymentStatus: task.payment?.escrowStatus || "not-paid",
            approval: task.approval
        }));

        // 5a. Apply pagination to task breakdown
        const page = query.page || 1;
        const limit = query.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const taskBreakdown = allTaskBreakdown.slice(startIndex, endIndex);
        const totalTasksInBreakdown = allTaskBreakdown.length;

        // Determine grouping granularity
        let groupBy: 'day' | 'month' = 'month';
        if (query.startDate && query.endDate) {
            const diffTime = Math.abs(query.endDate.getTime() - query.startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 90) {
                groupBy = 'day';
            }
        }

        // 6. Generate earnings timeline
        const earningsMap = new Map<string, number>();

        tasks.forEach(task => {
            if (task.payment?.amount && task.payment.amount > 0) {
                const date = new Date(task.createdAt);
                let key: string;
                let label: string;

                if (groupBy === 'day') {
                    key = date.toISOString().split('T')[0];
                    label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                } else {
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                }

                const current = earningsMap.get(label) || 0;
                earningsMap.set(label, current + task.payment.amount);
            }
        });

        const earningsTimeline: EarningsTimelineItem[] = Array.from(earningsMap.entries())
            .map(([month, earnings]) => ({ month, earnings }))
            .sort((a, b) => {
                const dateA = new Date(a.month);
                const dateB = new Date(b.month);
                return dateA.getTime() - dateB.getTime();
            });

        // 7. Calculate Activity Timeline
        const activityMap = new Map<string, { assigned: number; completed: number }>();

        tasks.forEach(task => {
            const createdDate = new Date(task.createdAt);
            let createdKey: string;

            if (groupBy === 'day') {
                createdKey = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            } else {
                createdKey = createdDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            }

            if (!activityMap.has(createdKey)) {
                activityMap.set(createdKey, { assigned: 0, completed: 0 });
            }
            activityMap.get(createdKey)!.assigned += 1;

            if (task.status === TaskStatus.DONE) {
                const updatedDate = new Date(task.updatedAt || task.createdAt);
                let updatedKey: string;

                if (groupBy === 'day') {
                    updatedKey = updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                } else {
                    updatedKey = updatedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                }

                if (!activityMap.has(updatedKey)) {
                    activityMap.set(updatedKey, { assigned: 0, completed: 0 });
                }
                activityMap.get(updatedKey)!.completed += 1;
            }
        });

        const activityTimeline = Array.from(activityMap.entries())
            .map(([month, stats]) => ({ month, ...stats }))
            .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

        // 8. Calculate Last Month Earnings
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

        let lastMonthEarnings = 0;
        tasks.forEach(task => {
            if (task.payment?.escrowStatus === "released" && task.payment.amount) {
                const paymentDate = new Date(task.createdAt); // Approximation
                if (paymentDate >= lastMonth && paymentDate <= lastMonthEnd) {
                    lastMonthEarnings += task.payment.amount;
                }
            }
        });

        return {
            totalEarnings,
            paidEarnings,
            pendingEarnings,
            totalTasks,
            completedTasks,
            pendingTasks,
            completionRate,
            taskBreakdown,
            totalTasksInBreakdown,
            earningsTimeline,
            activityTimeline,
            lastMonthEarnings
        };
    }
}
