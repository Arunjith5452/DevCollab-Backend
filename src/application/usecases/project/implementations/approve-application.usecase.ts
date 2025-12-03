import { ApproveApplicationDTO } from "@/application/dtos/project/approve-application.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ApplicationEntity } from "@/domain/entities/application.entity";
import { ProjectEntity } from "@/domain/entities/project.entity";
import { ApplicationStatus } from "@/domain/enums/project/application.enums";
import { IApplicationRepository } from "@/infrastructure/db/repository/interface/application.interface";
import { IProjectRepository } from "@/infrastructure/db/repository/interface/project.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject } from "inversify";

export class ApproveApplcationUseCase implements IExecute<ApproveApplicationDTO, { message: string }> {

    constructor(@inject(PROJECT_TYPES.ApplicationRepository) private readonly _applicationRepository: IApplicationRepository<ApplicationEntity>,
        @inject(PROJECT_TYPES.ProjectRepository) private readonly _projectRepository: IProjectRepository<ProjectEntity>
    ) { }

    async execute({ applicationId, projectId }: ApproveApplicationDTO): Promise<{ message: string }> {

        try {

            const application = await this._applicationRepository.findById(applicationId);
            if (!application) {
                throw new Error("Application not found");
            }
            await this._applicationRepository.updateStatus(applicationId, ApplicationStatus.APPROVED)

            const project = await this._projectRepository.findEntityById(projectId)

            if (!project) {
                throw new Error("Project not found");
            }

            project.addMember(application.userId.toString())
            let data = await this._projectRepository.updateEntity(project)

            return { message: "Application approved and contributor added successfully" }

        } catch (error) {
            throw error
        }

    }

}