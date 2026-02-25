import { UpdateProfileDTO } from "@/application/dtos/user/updateProfile.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { UserEntity } from "@/domain/entities/user.entity";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { ClientErrorStatus } from "@/domain/enums/status-codes/client-error-status.enum";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { errorResponse, successResponse } from "@/shared/utils/response.util";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { MESSAGES } from "@/shared/constants/messages";



@injectable()
export class UserController {
    constructor(
        @inject(USER_TYPES.GetUserProfileUseCase) private readonly _getUserProfileUseCase: IExecute<{ userId: string}, UserEntity>,
        @inject(USER_TYPES.UpdateUserProfileUseCase) private readonly _updateUserProfileUseCase: IExecute<{ userId: string, dto: UpdateProfileDTO }, UserEntity | null>
    ) { }


    /**
    * Fetches the profile details of the logged-in user.
    * @param req - Express request containing authenticated user details.
    * @param res - Express response object.
    * @returns JSON with the user's profile data.
    */
    async getProfileHandler(req: Request, res: Response): Promise<Response> {

        try {

            let userId = req.user.userId


            let result = await this._getUserProfileUseCase.execute({ userId})

            return successResponse(res, "", result)

        } catch (error) {

            return errorResponse(
                res,
                MESSAGES.USER.ERROR.PROFILE_ERROR,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )

        }
    }

    /**
   * Updates the profile of the logged-in user.
   * @param req - Express request containing userId and updated profile data in the body.
   * @param res - Express response object.
   * @returns JSON with updated user profile or null if update fails.
   */
    async updateProfile(req: Request, res: Response): Promise<Response> {
        try {

            let userId = req.user?.userId
            const result = await this._updateUserProfileUseCase.execute({ userId, dto: req.body })

            return successResponse(res, "", result)
        } catch (error) {
            return errorResponse(res,
                MESSAGES.USER.ERROR.UPDATE_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }

    /**
     * Connects GitHub account for an already logged-in user.
     * @param req - Express request containing githubAccessToken and githubUrl.
     * @param res - Express response object.
     * @returns JSON with success message.
     */
    async connectGitHub(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId;
            const { githubAccessToken, githubUrl } = req.body;

            if (!githubAccessToken) {
                return errorResponse(
                    res,
                    MESSAGES.USER.ERROR.GITHUB_TOKEN_REQUIRED,
                    ClientErrorStatus.BAD_REQUEST,
                    new Error("Missing githubAccessToken")
                );
            }

            await this._updateUserProfileUseCase.execute({
                userId,
                dto: { githubAccessToken, githubProfile: githubUrl }
            });

            return successResponse(res, MESSAGES.USER.SUCCESS.GITHUB_CONNECTED, null);
        } catch (error) {
            return errorResponse(
                res,
                MESSAGES.USER.ERROR.GITHUB_CONNECT_FAILED,
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }

}