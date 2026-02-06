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
import { Types } from "mongoose";

interface GetContributorStatsQuery {
    projectId: string;
    userId: string;
    page?: number;
    limit?: number;
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

        const projectObjectId = new Types.ObjectId(projectId);

        // 2. Fetch all tasks assigned to the contributor in this project
        const tasks = await this._taskRepository.findTask(
            {
                projectId: projectObjectId,
                assignedId: userId
            },
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

        // 6. Generate earnings timeline (group by month)
        const earningsMap = new Map<string, number>();

        tasks.forEach(task => {
            if (task.payment?.amount && task.payment.amount > 0) {
                const date = new Date(task.createdAt);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

                const current = earningsMap.get(monthName) || 0;
                earningsMap.set(monthName, current + task.payment.amount);
            }
        });

        const earningsTimeline: EarningsTimelineItem[] = Array.from(earningsMap.entries())
            .map(([month, earnings]) => ({ month, earnings }))
            .sort((a, b) => {
                const dateA = new Date(a.month);
                const dateB = new Date(b.month);
                return dateA.getTime() - dateB.getTime();
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
            earningsTimeline
        };
    }
}
