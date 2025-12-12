import { CheckUserBlockStatusUseCase } from "@/application/usecases/auth/implementations/check-user-block-status.usecase";
import { ForgotPasswordUseCase } from "@/application/usecases/auth/implementations/forgot-password.usecase";
import { GitHubLoginUseCase } from "@/application/usecases/auth/implementations/github-login.usecase";
import { GoogleLoginUseCase } from "@/application/usecases/auth/implementations/google-login.usecase";
import { LoginUseCase } from "@/application/usecases/auth/implementations/login.usecase";
import { LogoutUseCase } from "@/application/usecases/auth/implementations/logout.usecase";
import { RefreshTokenUseCase } from "@/application/usecases/auth/implementations/refresh-token.usecase";
import { RegiserUseCase } from "@/application/usecases/auth/implementations/register.usecase";
import { ResendOtpUseCase } from "@/application/usecases/auth/implementations/resend-otp.usecase";
import { ResetPasswordUseCase } from "@/application/usecases/auth/implementations/reset-password.usecase";
import { VerifyForgotOtpUseCase } from "@/application/usecases/auth/implementations/verifyforgot-otp.usecase";
import { VerifyOtpUseCase } from "@/application/usecases/auth/implementations/verity-otp.usecase";
import { AUTH_TYPES } from "@/infrastructure/di/types";
import { AuthController } from "@/presentation/http/controllers/auth.controller";
import { ContainerModule } from "inversify";


export const AuthModule = new ContainerModule(({ bind }) => {
    bind<AuthController>(AUTH_TYPES.AuthController).to(AuthController)
    bind<RegiserUseCase>(AUTH_TYPES.RegisterUseCase).to(RegiserUseCase)
    bind<VerifyOtpUseCase>(AUTH_TYPES.VerifyOtpUseCase).to(VerifyOtpUseCase)
    bind<LoginUseCase>(AUTH_TYPES.LoginUseCase).to(LoginUseCase)
    bind<RefreshTokenUseCase>(AUTH_TYPES.RefreshTokenUseCase).to(RefreshTokenUseCase)
    bind<ResendOtpUseCase>(AUTH_TYPES.ResendOtpUseCase).to(ResendOtpUseCase)
    bind<ForgotPasswordUseCase>(AUTH_TYPES.ForgotPasswordUseCase).to(ForgotPasswordUseCase)
    bind<VerifyForgotOtpUseCase>(AUTH_TYPES.VerifyForgotOtpUseCase).to(VerifyForgotOtpUseCase)
    bind<ResetPasswordUseCase>(AUTH_TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase)
    bind<CheckUserBlockStatusUseCase>(AUTH_TYPES.CheckUserBlockStatusUseCase).to(CheckUserBlockStatusUseCase)
    bind<GoogleLoginUseCase>(AUTH_TYPES.GoogleLoginUseCase).to(GoogleLoginUseCase)
    bind<GitHubLoginUseCase>(AUTH_TYPES.GitHubLoginUseCase).to(GitHubLoginUseCase)
    bind<LogoutUseCase>(AUTH_TYPES.LogoutUseCase).to(LogoutUseCase)
})