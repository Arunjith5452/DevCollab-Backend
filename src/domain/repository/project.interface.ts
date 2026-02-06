import { ProjectEntity } from "@/domain/entities/project.entity";
import { IBaseRepository } from "./base-repository.interface";
import { ProjectMemberNameOnly } from "@/application/dtos/tasks/res/get-project-members.dto";
import { ProjectFilter } from "@/domain/types/project-filter.type";


export interface IProjectRepository<T> extends IBaseRepository<T> {
    createProject(data: ProjectEntity): Promise<T>
    findByIdWithCreator(id: string): Promise<T | null>
    findEntityById(id: string): Promise<T | null>
    updateEntity(project: ProjectEntity): Promise<T | null>
    findByCreatorId(userId: string): Promise<ProjectEntity[]>
    findByIdWithPopulation(projectId: string): Promise<ProjectEntity | null>;
    getProjectMembersForAssignee(projectId: string): Promise<ProjectMemberNameOnly[]>;
    findFeatured(filter: ProjectFilter, options: { skip: number; limit: number }): Promise<ProjectEntity[]>;
    getTechStackDistribution(): Promise<{ name: string; count: number }[]>;
}