export interface DailyRegistration {
    _id: string;
    count: number;
}

export interface TechStackDistribution {
    _id: string;
    count: number;
}

export interface NewThisWeekStats {
    users: number;
    projects: number;
    creators: number;
    contributors: number;
}

export interface DashboardStats {
    totalUsers: number;
    totalProjects: number;
    activeContributors: number;
    totalCreators: number;
    dailyRegistrations: DailyRegistration[];
    techStackDistribution: TechStackDistribution[];
    newThisWeek: NewThisWeekStats;
}
