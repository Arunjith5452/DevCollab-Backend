import { ProjectResponseDTO } from "./project-response.dto";

export interface ApplicationResponseDTO {
    _id: string;
    _projectId: ProjectResponseDTO;
    _reason: string;
    _status: 'pending' | 'approved' | 'rejected' | string;
    _createdAt: string;
    _techStack: string[];
}
