export interface ProjectStatsDTO {
    completionRate: number;
    totalTasks: number;
    completedTasks: number;
    contributorPerformance: {
        userId: string;
        name: string;
        completedTasks: number;
        totalAssigned: number;
    }[];
    earningsTimeline: {
        month: string;
        earnings: number;
    }[];
    activityTimeline: {
        month: string;
        created: number;
        completed: number;
    }[];
}
