import { inject, injectable } from "inversify";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { SignedUrlResponse } from "../interfaces/signedUrl.usecase.interface";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { IStorageService } from "@/application/interface/storage.service.interface";

@injectable()
export class GenerateSignedUrlUseCase implements IExecute<{ fileName: string, fileType: string }, SignedUrlResponse> {
    constructor(
        @inject(COMMON_TYPES.StorageService) private readonly _storageService: IStorageService
    ) { }

    async execute({ fileName, fileType }: { fileName: string, fileType: string }): Promise<SignedUrlResponse> {
        try {

            if (!fileName || !fileType) {
                throw new Error("fileName & fileType are required");
            }

            const result = await this._storageService.generateUploadSignedUrl(fileName, fileType)

            return result

        } catch (error) {

            throw error

        }
    }
}