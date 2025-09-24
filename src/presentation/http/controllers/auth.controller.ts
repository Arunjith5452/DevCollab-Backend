import { forgotPasswordDTO } from "@/application/dtos/auth/forgotPassword.dto";
import { LoginDTO } from "@/application/dtos/auth/login.dto";
import { RefreshDTO } from "@/application/dtos/auth/refresh.dto";
import { RegisterDTO } from "@/application/dtos/auth/register.dto";
import { VerifyOtpDTO } from "@/application/dtos/auth/verifyOtp.dto";
import { IExecute } from "@/application/usecases/auth/interfaces/execute-usecase.interface";
import { AuthResult, VerifyOtpResult } from "@/domain/types/auth";
import { RefreshResult } from "@/domain/types/auth/refresh.types";
import { AUTH_TYPES } from "@/infrastructure/di/types";
import { Request, Response } from "express"
import { inject, injectable } from "inversify"


@injectable()
export class AuthController {
    constructor(
        @inject(AUTH_TYPES.RegisterUseCase) private readonly _registerUseCase: IExecute<RegisterDTO, {token:string}>,
        @inject(AUTH_TYPES.VerifyOtpUseCase) private readonly _verifyOtpUseCase: IExecute<VerifyOtpDTO, VerifyOtpResult>,
        @inject(AUTH_TYPES.LoginUseCase) private readonly _loginUseCase: IExecute<LoginDTO, AuthResult>,
        @inject(AUTH_TYPES.RefreshTokenUseCase) private readonly _refreshTokenUseCase: IExecute<RefreshDTO, RefreshResult>,
        @inject(AUTH_TYPES.ForgotPasswordUseCase) private readonly _forgotPasswordUseCase: IExecute<forgotPasswordDTO,void>
    ) { }

    async Register(req: Request, res: Response) {
        try {
            const result = await this._registerUseCase.execute(req.body)

            return res.json(result)
        } catch (error) {
            const err = error as Error
            return res.status(500).json(err.message)
        }
    }

    async VerifyOtp(req: Request, res: Response) {
        try {

            const result = await this._verifyOtpUseCase.execute(req.body)
            console.log("result verifyoutpocontroller",result)
            return res.json(result)

        } catch (error) {

            const err = error as Error
            return res.status(500).json(err.message)
        }
    }

    async Login(req: Request, res: Response) {
        console.log("Reached login Controller")
        try {

            const result = await this._loginUseCase.execute(req.body)

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            return res.json({
                message: result.message,
                accessToken: result.accessToken
            })
        } catch (error) {

            const err = error as Error
            return res.status(500).json(err.message)
        }
    }

    async RefreshToken(req: Request, res: Response) {

        try {

            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) throw new Error("No refresh token provided")

            const result = await this._refreshTokenUseCase.execute(refreshToken)

            return res.json(result)

        } catch (error) {
            const err = error as Error
            return res.status(401).json({ message: err.message })
        }

    }

    async forgotPassword(req:Request,res:Response){

        try {

            const result = await this._forgotPasswordUseCase.execute(req.body)
            return res.json(result)
            
        } catch (error) {
             const err = error as Error
             return res.status(401).json({message:err.message})
        }

    }

    async Logout(req:Request,res:Response){

        try {
            const refreshToken = req.cookies.refreshToken
            const result = await this._loginUseCase.execute(refreshToken)
        
            res.clearCookie("refreshToken")
             return res.json(result);
            
        } catch (error) {
            let err = error as Error
            return res.status(401).json({ message: err.message })
        }

    }
}