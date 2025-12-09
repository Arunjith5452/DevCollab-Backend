import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ApplicationEntity } from "@/domain/entities/application.entity";
import { IApplicationRepository } from "@/infrastructure/db/repository/interface/application.interface";
import { PROJECT_TYPES } from "@/infrastructure/di/types";
import { inject, injectable } from "inversify";

@injectable()
export class GetMyAppliedProjectUseCase implements IExecute<{ userId: string }, ApplicationEntity[]> {

    constructor(@inject(PROJECT_TYPES.ApplicationRepository) private readonly _applicationRepository: IApplicationRepository<ApplicationEntity>
    ) { }


    async execute({ userId }: { userId: string }): Promise<ApplicationEntity[]> {
        try {

            let project = await this._applicationRepository.findAppliedProjectsByUser(userId)

             return project

        } catch (error) {
            throw error
        }
    }

}