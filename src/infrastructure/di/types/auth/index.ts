
export const AUTH_TYPES = {
  AuthController: Symbol.for("AuthController"),
  RegisterUseCase: Symbol.for("RegisterUseCase"),
  VerifyOtpUseCase: Symbol.for("VerifyOtpUseCase"),
  LoginUseCase: Symbol.for("LoginUseCase"),
  RefreshTokenUseCase: Symbol.for("RefreshTokenUseCase"),
  ResendOtpUseCase: Symbol.for("ResendOtpUseCase"),
  ForgotPasswordUseCase: Symbol.for("ForgotPasswordUseCase"),
  VerifyForgotOtpUseCase: Symbol.for("VerifyForgotOtpUseCase"),
  ResetPasswordUseCase: Symbol.for("ResetPasswordUseCase"),
  CheckUserBlockStatusUseCase: Symbol.for('CheckUserBlockStatusUseCase'),
  GoogleLoginUseCase:Symbol.for('GoogleLoginUseCase'),
  GitHubLoginUseCase:Symbol.for('GitHubLoginUseCase'),
  LogoutUseCase:Symbol.for("LogoutUseCase")
};
