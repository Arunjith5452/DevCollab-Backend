export interface ApplicationResponseDTO {
    id: string;
    userId: string;
    projectId: string | { id: string; title: string; description: string }; // Can be string or populated ProjectEntity
    techStack: string[];
    profileUrl: string;
    reason: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
