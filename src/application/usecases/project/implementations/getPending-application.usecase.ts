import { ResponsePendingApplicationDto } from "@/application/dtos/project/res/pending-application.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { PendingApplicationMapper } from "@/application/mapper/project/pending-application.mapper";
import { ApplicationEntity } from "@/domain/entities/application.entity";
import { IApplicationRepository } from "@/infrastructure/db/repository/interface/application.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject } from "inversify";

export class GetPendingApplicationUseCase implements IExecute<string, ResponsePendingApplicationDto[]> {
    private readonly _applicationMapper = new PendingApplicationMapper();

    constructor(
        @inject(PROJECT_TYPES.ApplicationRepository)
        private readonly _applicationRepository: IApplicationRepository<ApplicationEntity>
    ) { }

    async execute(projectId: string): Promise<ResponsePendingApplicationDto[]> {
        try {
            const applications = await this._applicationRepository.getPendingByProject(projectId);

            if (!applications || applications.length === 0) {
                return [];
            }

            return applications.map(app => this._applicationMapper.toResponse(app));

        } catch (error) {
            throw error;
        }
    }
}