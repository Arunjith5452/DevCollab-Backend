import { ProjectEntity } from "@/domain/entities/project.entity";
import { IBaseRepository } from "./base-repository.interface";



export interface IProjectRepository<T> extends IBaseRepository<T> {
    createProject(data: ProjectEntity): Promise<T>
    findByIdWithCreator(id: string): Promise<T | null>
    findEntityById(id: string): Promise<T | null>
    updateEntity(project: ProjectEntity): Promise<T | null>
    findByCreatorId(userId: string): Promise<ProjectEntity[]>
    findByIdWithPopulation(projectId: string): Promise<ProjectEntity | null>;
}