import { Router, Request, Response } from "express"
const router = Router();
import { conatiner } from "@/infrastructure/di/inversify.di"
import { AuthController } from "@/presentation/http/controllers/auth.controller";
import { RegisterDTO } from "@/application/dtos/auth/register.dto";
import { validateDTO } from "@/shared/middlewares/validate-dto.middlware";
import { VerifyOtpDTO } from "@/application/dtos/auth/verifyOtp.dto";
import { LoginDTO } from "@/application/dtos/auth/login.dto";
import { RefreshDTO } from "@/application/dtos/auth/refresh.dto";
import { LogoutDTO } from "@/application/dtos/auth/logout.dto";
import { forgotPasswordDTO } from "@/application/dtos/auth/forgotPassword.dto";

const authController = conatiner.get(AuthController)

router.post("/auth/signup", validateDTO(RegisterDTO), (req: Request, res: Response) => authController.Register(req, res))
router.post("/auth/verify-otp", validateDTO(VerifyOtpDTO), (req: Request, res: Response) => authController.VerifyOtp(req, res))
router.post("/auth/login", validateDTO(LoginDTO), (req: Request, res: Response) => authController.Login(req, res))
router.post("/auth/refresh", validateDTO(RefreshDTO) , (req:Request,res:Response) => authController.RefreshToken(req,res) )
router.post("/auth/forgot-password",validateDTO(forgotPasswordDTO),(req:Request,res:Response)=>authController.forgotPassword(req,res))
router.post("/auth/logout", validateDTO(LogoutDTO) , (req:Request,res:Response) => authController.Logout(req,res))

export { router as authRouter }                           