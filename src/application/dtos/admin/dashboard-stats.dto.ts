import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class DailyRegistrationDTO {
    @Expose()
    _id!: string;

    @Expose()
    count!: number;

    constructor(data: Partial<DailyRegistrationDTO>) {
        Object.assign(this, data);
    }
}

@Exclude()
export class TechStackDistributionDTO {
    @Expose()
    _id!: string;

    @Expose()
    count!: number;

    constructor(data: Partial<TechStackDistributionDTO>) {
        Object.assign(this, data);
    }
}

@Exclude()
export class NewThisWeekStatsDTO {
    @Expose()
    users!: number;

    @Expose()
    projects!: number;

    @Expose()
    creators!: number;

    @Expose()
    contributors!: number;

    constructor(data: Partial<NewThisWeekStatsDTO>) {
        Object.assign(this, data);
    }
}

@Exclude()
export class DashboardStatsDTO {
    @Expose()
    totalUsers!: number;

    @Expose()
    totalProjects!: number;

    @Expose()
    activeContributors!: number;

    @Expose()
    totalCreators!: number;

    @Expose()
    @Type(() => DailyRegistrationDTO)
    dailyRegistrations!: DailyRegistrationDTO[];

    @Expose()
    @Type(() => TechStackDistributionDTO)
    techStackDistribution!: TechStackDistributionDTO[];

    @Expose()
    @Type(() => NewThisWeekStatsDTO)
    newThisWeek!: NewThisWeekStatsDTO;

    constructor(data: Partial<DashboardStatsDTO>) {
        Object.assign(this, data);
    }
}
