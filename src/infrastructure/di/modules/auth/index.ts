import { ForgotPasswordUseCase } from "@/application/usecases/auth/implementations/forgot-password.usecase";
import { LoginUseCase } from "@/application/usecases/auth/implementations/login.usecase";
import { RefreshTokenUseCase } from "@/application/usecases/auth/implementations/refresh-token.usecase";
import { RegiserUseCase } from "@/application/usecases/auth/implementations/register.usecase";
import { VerifyOtpUseCase } from "@/application/usecases/auth/implementations/verity-otp.usecase";
import { AUTH_TYPES } from "@/infrastructure/di/types";
import { AuthController } from "@/presentation/http/controllers/auth.controller";
import { ContainerModule } from "inversify";


export const AuthModule = new ContainerModule(({bind})=>{
    bind<AuthController>(AUTH_TYPES.AuthController).to(AuthController)
    bind<RegiserUseCase>(AUTH_TYPES.RegisterUseCase).to(RegiserUseCase)
    bind<VerifyOtpUseCase>(AUTH_TYPES.VerifyOtpUseCase).to(VerifyOtpUseCase)
    bind<LoginUseCase>(AUTH_TYPES.LoginUseCase).to(LoginUseCase)
    bind<RefreshTokenUseCase>(AUTH_TYPES.RefreshTokenUseCase).to(RefreshTokenUseCase)
    bind<ForgotPasswordUseCase>(AUTH_TYPES.ForgotPasswordUseCase).to(ForgotPasswordUseCase)
})