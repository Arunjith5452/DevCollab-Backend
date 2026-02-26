export interface GetProjectMembersResult {
    users: Array<{
        id: string;
        name: string;
        email: string;
        role: "contributor" | "maintainer";
        joinedAt: string;
    }>;
    currentPage: number;
    totalPages: number;
    totalItems: number;
}