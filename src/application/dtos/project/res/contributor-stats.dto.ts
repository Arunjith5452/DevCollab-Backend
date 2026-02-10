export interface TaskBreakdownItem {
    taskId: string;
    title: string;
    amount: number;
    creatorName: string;
    createdAt: Date;
    status: string;
    paymentStatus: "not-paid" | "held" | "released";
    approval?: string;
}

export interface EarningsTimelineItem {
    month: string;
    earnings: number;
}

export interface ContributorStatsDTO {
    totalEarnings: number;
    paidEarnings: number;
    pendingEarnings: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionRate: number;
    taskBreakdown: TaskBreakdownItem[];
    totalTasksInBreakdown: number; // Total count for pagination
    earningsTimeline: EarningsTimelineItem[];
    activityTimeline: {
        month: string;
        assigned: number;
        completed: number;
    }[];
    lastMonthEarnings: number;
}

