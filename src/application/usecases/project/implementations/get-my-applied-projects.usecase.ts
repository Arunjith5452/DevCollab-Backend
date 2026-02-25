import { IExecute } from "@/application/interface/execute.usecase.interface";
import { IApplicationRepository } from "@/domain/repository/application.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject, injectable } from "inversify";
import { ApplicationResponseDTO } from "@/application/dtos/project/res/application-response.dto";
import { ApplicationPresentationMapper } from "@/infrastructure/mappers/application-presentation.mapper";
import { ApplicationEntity } from "@/domain/entities/application.entity";

@injectable()
export class GetMyAppliedProjectUseCase implements IExecute<{ userId: string, page?: number, limit?: number }, { applications: ApplicationResponseDTO[], total: number }> {

    constructor(
        @inject(PROJECT_TYPES.ApplicationRepository) private readonly _applicationRepository: IApplicationRepository<ApplicationEntity>,
        @inject(ApplicationPresentationMapper) private readonly _applicationMapper: ApplicationPresentationMapper
    ) { }

    async execute({ userId, page = 1, limit = 10 }: { userId: string, page?: number, limit?: number }): Promise<{ applications: ApplicationResponseDTO[], total: number }> {
        try {
            const skip = (page - 1) * limit;
            const { applications, total } = await this._applicationRepository.findAppliedProjectsByUser(userId, { skip, limit });

            return {
                applications: applications.map(app => this._applicationMapper.toResponseDTO(app)),
                total
            };
        } catch (error) {
            throw error;
        }
    }
}