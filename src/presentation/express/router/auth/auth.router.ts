import { Router, Request, Response } from "express"
const router = Router();
import { container } from "@/infrastructure/di/inversify.di"
import { AuthController } from "@/presentation/http/controllers/auth.controller";
import { RegisterDTO } from "@/application/dtos/auth/register.dto";
import { VerifyOtpDTO } from "@/application/dtos/auth/verifyOtp.dto";
import { LoginDTO } from "@/application/dtos/auth/login.dto";
import { LogoutDTO } from "@/application/dtos/auth/logout.dto";
import { forgotPasswordDTO } from "@/application/dtos/auth/forgotPassword.dto";
import { ResendOtp } from "@/application/dtos/auth/resend.dto";
import { VerifyForgotOtpDTO } from "@/application/dtos/auth/forgotOtp.dto";
import { ResetPasswordDTO } from "@/application/dtos/auth/resetPassword.dto";
import { GoogleLoginDTO } from "@/application/dtos/auth/google-Login.dto";
import { validateDTO } from "../../middlewares/validate-dto.middlware";
import { GithubLoginDTO } from "@/application/dtos/auth/gitHub-Login.dto";


const authController = container.get(AuthController)

router.post("/auth/signup", validateDTO(RegisterDTO), (req: Request, res: Response) => authController.Register(req, res))
router.post("/auth/verify-otp", validateDTO(VerifyOtpDTO), (req: Request, res: Response) => authController.VerifyOtp(req, res))
router.post("/auth/login", validateDTO(LoginDTO), (req: Request, res: Response) => authController.Login(req, res))
router.post("/auth/refresh", (req: Request, res: Response) => authController.RefreshToken(req, res))
router.post("/auth/forgot-password", validateDTO(forgotPasswordDTO), (req: Request, res: Response) => authController.ForgotPassword(req, res))
router.post("/auth/verifyForgot-otp", validateDTO(VerifyForgotOtpDTO), (req: Request, res: Response) => authController.VerifyForgotOtp(req, res))
router.post("/auth/reset-password", validateDTO(ResetPasswordDTO), (req: Request, res: Response) => authController.ResetPassword(req, res))
router.post("/auth/logout",(req: Request, res: Response) => authController.Logout(req, res))
router.post("/auth/resend-otp", validateDTO(ResendOtp), (req: Request, res: Response) => authController.ResendOtp(req, res))
router.post("/auth/google/callback", validateDTO(GoogleLoginDTO), (req: Request, res: Response) => authController.googleLogin(req, res))
router.post("/auth/github/callback",validateDTO(GithubLoginDTO),(req:Request,res:Response)=>authController.gitHubLogin(req,res))


export { router as authRouter }                           