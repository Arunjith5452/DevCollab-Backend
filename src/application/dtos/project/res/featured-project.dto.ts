export interface FeaturedProjectDTO {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    creatorName: string;
    applicationCount: number;
    status: string;
    image?: string;
}
