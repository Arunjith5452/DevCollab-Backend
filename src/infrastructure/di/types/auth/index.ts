import { ForgotPasswordUseCase } from "@/application/usecases/auth/implementations/forgot-password.usecase";
import { RefreshTokenUseCase } from "@/application/usecases/auth/implementations/refresh-token.usecase";

export const AUTH_TYPES = {
  AuthController: Symbol.for("AuthController"),
  RegisterUseCase:Symbol.for("RegisterUseCase"),
  VerifyOtpUseCase:Symbol.for("VerifyOtpUseCase"),
  LoginUseCase:Symbol.for("LoginUseCase"),
  RefreshTokenUseCase:Symbol.for("RefreshTokenUseCase"),
  ForgotPasswordUseCase:Symbol.for("ForgotPasswordUseCase")
};
