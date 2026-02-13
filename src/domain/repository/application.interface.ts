import { ApplicationEntity } from "@/domain/entities/application.entity";
import { IBaseRepository } from "./base-repository.interface";


export interface IApplicationRepository<T> extends IBaseRepository<T> {
    applyToProject(data: ApplicationEntity): Promise<T>
    findExistingApplication(userId: string, projectId: string): Promise<T | null>;
    getPendingByProject(projectId: string): Promise<T[]>
    updateStatus(applicationId: string, newStatus: string): Promise<void>
    findAppliedProjectsByUser(userId: string): Promise<ApplicationEntity[]>
    findLatestApproved(limit: number): Promise<ApplicationEntity[]>
  }