import { forgotPasswordDTO } from "@/application/dtos/auth/forgotPassword.dto";
import { GithubLoginDTO } from "@/application/dtos/auth/gitHub-Login.dto";
import { GoogleLoginDTO } from "@/application/dtos/auth/google-Login.dto";
import { LoginDTO } from "@/application/dtos/auth/login.dto";
import { RegisterDTO } from "@/application/dtos/auth/register.dto";
import { ResetPasswordDTO } from "@/application/dtos/auth/resetPassword.dto";
import { VerifyOtpDTO } from "@/application/dtos/auth/verifyOtp.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { AuthResult } from "@/domain/types/auth";
import { RefreshResult } from "@/domain/types/auth/refresh.types";
import { AUTH_TYPES } from "@/infrastructure/di/types";
import { errorResponse, successResponse } from "@/shared/utils/response.util";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";


@injectable()
export class AuthController {
    constructor(
        @inject(AUTH_TYPES.RegisterUseCase) private readonly _registerUseCase: IExecute<RegisterDTO, { token: string }>,
        @inject(AUTH_TYPES.VerifyOtpUseCase) private readonly _verifyOtpUseCase: IExecute<VerifyOtpDTO, { message: string }>,
        @inject(AUTH_TYPES.LoginUseCase) private readonly _loginUseCase: IExecute<LoginDTO, AuthResult>,
        @inject(AUTH_TYPES.RefreshTokenUseCase) private readonly _refreshTokenUseCase: IExecute<string, RefreshResult>,
        @inject(AUTH_TYPES.ForgotPasswordUseCase) private readonly _forgotPasswordUseCase: IExecute<forgotPasswordDTO, void>,
        @inject(AUTH_TYPES.ResendOtpUseCase) private readonly _resendOtpUseCase: IExecute<VerifyOtpDTO, { message: string }>,
        @inject(AUTH_TYPES.VerifyForgotOtpUseCase) private readonly _verifyForgotOtpUseCase: IExecute<VerifyOtpDTO, { message: string }>,
        @inject(AUTH_TYPES.ResetPasswordUseCase) private readonly _resetPasswordUseCase: IExecute<ResetPasswordDTO, { message: string }>,
        @inject(AUTH_TYPES.GoogleLoginUseCase) private readonly _googleLoginUseCase: IExecute<GoogleLoginDTO, AuthResult>,
        @inject(AUTH_TYPES.GitHubLoginUseCase) private readonly _gitHubLoginUseCase: IExecute<GithubLoginDTO, AuthResult>
    ) { }

    /**
     * Registers a new user.
     * @param req - Express request with registration data.
     * @param res - Express response object.
     * @returns JSON with registration result.
     */
    async Register(req: Request, res: Response) {
        try {
            const result = await this._registerUseCase.execute(req.body);
            return successResponse(res, "", result.token);
        } catch (error) {
            return errorResponse(res,
                "Registration failed",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }

    /**
     * Verifies user OTP after registration.
     * @param req - Express request with OTP data.
     * @param res - Express response object.
     * @returns JSON with OTP verification message.
     */
    async VerifyOtp(req: Request, res: Response) {
        try {
            const result = await this._verifyOtpUseCase.execute(req.body);
            return successResponse(res, result.message)
        } catch (error) {
            return errorResponse(res,
                "Otp verification failed",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }

    /**
     * Verifies OTP for forgot password flow.
     * @param req - Express request with OTP data.
     * @param res - Express response object.
     * @returns JSON with OTP verification message.
     */
    async VerifyForgotOtp(req: Request, res: Response) {
        try {
            const result = await this._verifyForgotOtpUseCase.execute(req.body)

            return successResponse(res, result.message)

        } catch (error) {

            return errorResponse(res,
                "VerifiyForgotOtp failed",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )

        }
    }

    /**
     * Logs in a user, sets auth cookies, and returns user details.
     * @param req - Express request with login data.
     * @param res - Express response for sending tokens.
     * @returns JSON with user role, message, and token.
     */

    async Login(req: Request, res: Response) {
        try {
            const result = await this._loginUseCase.execute(req.body);

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
            });

            res.cookie("accessToken", result.accessToken, {

                httpOnly: true,
                sameSite: "strict",
                maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE),
            });

            return successResponse(res, result.message, {
                role: result.role,
                accessToken: result.accessToken,
            });
        } catch (error) {
            return errorResponse(
                res,
                "Login failed",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );
        }
    }

    /**
     * Refreshes access token using the stored refresh token.
     * @param req - Express request containing refresh token cookie.
     * @param res - Express response for sending new access token.
     * @returns JSON with new access token.
     */
    async RefreshToken(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            const result = await this._refreshTokenUseCase.execute(refreshToken);

            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE),
            });

            return successResponse(res, result.message!, {
                accessToken: result.accessToken,
            });

        } catch (error) {

            errorResponse(
                res,
                "RefreshToken failed",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )

        }
    }

    /**
     * Resends OTP to the user.
     * @param req - Express request with user data.
     * @param res - Express response object.
     * @returns JSON with resend OTP message.
     */
    async ResendOtp(req: Request, res: Response) {
        try {
            const result = await this._resendOtpUseCase.execute(req.body);

            return successResponse(res, result.message)

        } catch (error) {

            return errorResponse(res,
                "Resend otp failed",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )

        }
    }

    /**
     * Sends forgot password OTP to user’s email.
     * @param req - Express request with email data.
     * @param res - Express response object.
     * @returns JSON with forgot password result.
     */
    async ForgotPassword(req: Request, res: Response) {
        try {
            const result = await this._forgotPasswordUseCase.execute(req.body);

            successResponse(res, '')

        } catch (error) {
            return errorResponse(res,
                "forgotPassword failed",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }

    /**
     * Resets user password after OTP verification.
     * @param req - Express request with reset password data.
     * @param res - Express response object.
     * @returns JSON with password reset result.
     */
    async ResetPassword(req: Request, res: Response) {
        try {
            const result = await this._resetPasswordUseCase.execute(req.body);

            return successResponse(res, result.message)

        } catch (error) {
            return errorResponse(res,
                "reset password failed",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }

    async googleLogin(req: Request, res: Response) {

        try {

            const result = await this._googleLoginUseCase.execute(req.body)

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
            });

            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE),
            });

            return successResponse(res, result.message, {
                role: result.role,
            });

        } catch (error) {

            return errorResponse(
                res,
                "Gogle Authentication failed",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );

        }

    }

    async gitHubLogin(req: Request, res: Response) {

        try {

            const result = await this._gitHubLoginUseCase.execute(req.body)

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
            });

            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE),
            });


            return successResponse(res, result.message, {
                role: result.role
            })

        } catch (error) {

            return errorResponse(
                res,
                "GitHub Authentication failed",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            );

        }
    }

    /**
     * Logs out user by clearing the refresh token cookie.
     * @param req - Express request with user cookies.
     * @param res - Express response object.
     * @returns JSON with logout result.
     */
    async Logout(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken;
            const result = await this._loginUseCase.execute(refreshToken);

            res.clearCookie("refreshToken");
            return res.json(result);
        } catch (error) {
            return errorResponse(res,
                "Logout failed",
                ServerErrorStatus.INTERNAL_SERVER_ERROR,
                error
            )
        }
    }


}
