import { IExecute } from "@/application/interface/execute.usecase.interface";
import { SignedUrlResponse } from "../interfaces/signedUrl.usecase.interface";
import { generateUploadSignedUrl } from "@/infrastructure/providers/s3-bucket/s3Service";



export class GenerateSignedUrlUseCase implements IExecute<{fileName:string,fileType:string}, SignedUrlResponse> {
    constructor() { }

    async execute({ fileName, fileType }:{fileName:string,fileType:string}): Promise<SignedUrlResponse> {
        try {

            if (!fileName || !fileType) {
                throw new Error("fileName & fileType are required");
            }

            const result = await generateUploadSignedUrl(fileName, fileType)

            return result

        } catch (error) {

            throw error

        }
    }
}