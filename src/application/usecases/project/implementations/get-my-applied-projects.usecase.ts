import { IExecute } from "@/application/interface/execute.usecase.interface";
import { IApplicationRepository } from "@/domain/repository/application.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject, injectable } from "inversify";
import { ApplicationResponseDTO } from "@/application/dtos/project/res/application-response.dto";
import { ApplicationPresentationMapper } from "@/infrastructure/mappers/application-presentation.mapper";
import { ApplicationEntity } from "@/domain/entities/application.entity";

@injectable()
export class GetMyAppliedProjectUseCase implements IExecute<{ userId: string }, ApplicationResponseDTO[]> {

    constructor(
        @inject(PROJECT_TYPES.ApplicationRepository) private readonly _applicationRepository: IApplicationRepository<ApplicationEntity>,
        @inject(ApplicationPresentationMapper) private readonly _applicationMapper: ApplicationPresentationMapper
    ) { }

    async execute({ userId }: { userId: string }): Promise<ApplicationResponseDTO[]> {
        try {

            let applications = await this._applicationRepository.findAppliedProjectsByUser(userId)

            return applications.map(app => this._applicationMapper.toResponseDTO(app));

        } catch (error) {
            throw error
        }
    }
}