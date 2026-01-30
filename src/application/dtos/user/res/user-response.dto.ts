export interface UserResponseDTO {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
    bio?: string;
    title?: string;
    techStack?: string[];
    githubProfile?: string;
    createdProjectsCount?: number;
    contributionsCount?: number;
    recentActivities?: UserActivity[];
}

export interface UserActivity {
    type: 'project_created' | 'joined_project';
    title: string;
    timestamp: string;
}
