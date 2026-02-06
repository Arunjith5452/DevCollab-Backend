export interface ActivityItem {
    type: 'user' | 'project' | 'application';
    id: string;
    name: string;
    email?: string;
    title: string;
    desc: string;
    applicantName?: string;
    projectTitle?: string;
    status?: string;
    createdAt: Date;
}
