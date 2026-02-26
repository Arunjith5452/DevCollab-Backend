import { IExecute } from "@/application/interface/execute.usecase.interface";
import { SignedUrlResponse } from "@/application/usecases/user/interfaces/signedUrl.usecase.interface";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { errorResponse, successResponse } from "@/shared/utils/response.util";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { MESSAGES } from "@/shared/constants/messages";



@injectable()
export class FileController {
    constructor(@inject(USER_TYPES.GenerateSignedUrlUseCase) private readonly _generateSignedUrlUseCase: IExecute<{ fileName: string, fileType: string }, SignedUrlResponse>
    ) { }


    /**
     * Generates a pre-signed URL for secure file upload.
     * @param req - Express request containing `fileName` and `fileType` in the body.
     * @param res - Express response object.
     * @returns JSON response with the generated signed URL.
     */
    async signedUrl(req: Request, res: Response): Promise<Response> {

        try {

            const result = await this._generateSignedUrlUseCase.execute(req.body)

            return successResponse(res, "", result)

        } catch (error) {

            return errorResponse(res, MESSAGES.FILE.ERROR.SIGNED_URL_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );


        }
    }


}