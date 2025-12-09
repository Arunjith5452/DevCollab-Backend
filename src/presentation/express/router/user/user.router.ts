import { container } from "@/infrastructure/di/inversify.di";
import { UserController } from "@/presentation/http/controllers/user.controller";
import { Request, Response, Router } from "express";
import { AuthGuard } from "../../middlewares/auth-guard.middlware";
import { Role } from "@/domain/enums/role.enum";
import { BlockGuard } from "../../middlewares/block-guard.middlware";


const router = Router()



const userController = container.get(UserController)


router.get('/users/profile',AuthGuard([Role.USER]),BlockGuard([Role.USER]),(req:Request,res:Response)=>userController.getProfileHandler(req,res))
router.patch('/users/profile',AuthGuard([Role.USER]),BlockGuard([Role.USER]),(req:Request,res:Response)=>userController.updateProfile(req,res))

export {router as userRouter}