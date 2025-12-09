import { RejectApplicationDTO } from "@/application/dtos/project/reject-application.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ApplicationEntity } from "@/domain/entities/application.entity";
import { ApplicationStatus } from "@/domain/enums/project/application.enums";
import { IApplicationRepository } from "@/infrastructure/db/repository/interface/application.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject, injectable } from "inversify";

@injectable()
export class RejectApplicationUseCase implements IExecute<RejectApplicationDTO, { message: string }> {
    constructor(@inject(PROJECT_TYPES.ApplicationRepository) private readonly _applicationRepository: IApplicationRepository<ApplicationEntity>) { }

    async execute({ applicationId }: RejectApplicationDTO): Promise<{ message: string }> {

        try {

            const application = await this._applicationRepository.findById(applicationId)

            if (!application) {
                throw new Error("Application not found")
            }

            await this._applicationRepository.updateStatus(applicationId, ApplicationStatus.REJECTED)

            return { message: "Application rejected" }

        } catch (error) {
            throw error
        }

    }

}