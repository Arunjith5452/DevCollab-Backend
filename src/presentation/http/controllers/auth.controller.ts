import { forgotPasswordDTO } from "@/application/dtos/auth/forgotPassword.dto";
import { LoginDTO } from "@/application/dtos/auth/login.dto";
import { RegisterDTO } from "@/application/dtos/auth/register.dto";
import { ResetPasswordDTO } from "@/application/dtos/auth/resetPassword.dto";
import { VerifyOtpDTO } from "@/application/dtos/auth/verifyOtp.dto";
import { IExecute } from "@/application/usecases/auth/interfaces/execute-usecase.interface";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";
import { SuccessStatus } from "@/domain/enums/status-codes/success-status.enum";
import { AuthResult } from "@/domain/types/auth";
import { RefreshResult } from "@/domain/types/auth/refresh.types";
import { AUTH_TYPES } from "@/infrastructure/di/types";
import { Request, Response } from "express"
import { inject, injectable } from "inversify"


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
        @inject(AUTH_TYPES.ResetPasswordUseCase) private readonly _resetPasswordUseCase: IExecute<ResetPasswordDTO, { message: string }>
    ) { }

    async Register(req: Request, res: Response) {

        try {
            const result = await this._registerUseCase.execute(req.body)

            return res.json(result)
        } catch (error) {
            const err = error as Error
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json(err.message)
        }
    }

    async VerifyOtp(req: Request, res: Response) {
        try {

            const result = await this._verifyOtpUseCase.execute(req.body)
            return res.json(result)

        } catch (error) {

            const err = error as Error
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json(err.message)
        }
    }


    async VerifyForgotOtp(req: Request, res: Response) {
        try {
            const result = await this._verifyForgotOtpUseCase.execute(req.body);
            return res.json(result);
        } catch (error) {
            const err = error as Error;
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    AuthVerify(req: Request, res: Response) {
        return res.status(SuccessStatus.OK).json({
            success: true, user: {
                email: req.user?.email, id: req.user?.userId
            }
        })
    }

    async Login(req: Request, res: Response) {
        try {


            const result = await this._loginUseCase.execute(req.body)

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })


            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            })

            return res.json({
                message: result.message,
                data: result.accessToken
            })
        } catch (error) {

            const err = error as Error
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json(err.message)
        }
    }

    async RefreshToken(req: Request, res: Response) {

        try {
            const refreshToken = req.cookies?.refreshToken
            const result = await this._refreshTokenUseCase.execute(refreshToken)

            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            })

            return res.json({ data: result.accessToken })

        } catch (error) {
            const err = error as Error
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
        }

    }

    async ResendOtp(req: Request, res: Response) {

        try {

            const result = await this._resendOtpUseCase.execute(req.body)
            return res.json(result)

        } catch (error) {
            const err = error as Error
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json(err.message)
        }

    }

    async ForgotPassword(req: Request, res: Response) {

        try {

            const result = await this._forgotPasswordUseCase.execute(req.body)
            return res.json(result)

        } catch (error) {
            const err = error as Error
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
        }

    }

    async ResetPassword(req: Request, res: Response) {

        try {
            const result = await this._resetPasswordUseCase.execute(req.body)
            return res.json(result)

        } catch (error) {

            const err = error as Error
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })

        }

    }

    async Logout(req: Request, res: Response) {

        try {
            const refreshToken = req.cookies.refreshToken
            const result = await this._loginUseCase.execute(refreshToken)

            res.clearCookie("refreshToken")
            return res.json(result);

        } catch (error) {
            let err = error as Error
            return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({ message: err.message })
        }

    }
}