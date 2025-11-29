export class ResponsePendingApplicationDto {
    public readonly id!: string;
    public readonly user!: {
        name: string;
        github: string | null;
        bio:string | null;
        profileImage:string | null
    };
    public readonly profileUrl!: string;
    public readonly reason!: string;
    public readonly techStack!: string[];
    public readonly createdAt!: string;  
}