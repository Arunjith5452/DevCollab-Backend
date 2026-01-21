export interface ProjectResponseDTO {
    id: string;
    _id: string;
    creatorId: string;
    title: string;
    description: string;
    githubRepo?: string;
    techStack: string[];
    difficulty: string;
    startDate: Date;
    endDate: Date;
    expectation?: string;
    visibility: string;
    requiredRoles: { role: string; count: string; experience: string }[];
    status: string;
    createdAt: Date;
    updatedAt?: Date;
    image?: string;
    roleNeeded?: string;
    members: {
        userId: string;
        role: string;
        joinedAt: string;
        status: string;
    }[];
    creator?: {
        name: string;
        email: string;
        avatar?: string | null;
    };
}
