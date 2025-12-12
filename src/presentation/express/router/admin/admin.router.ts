import { UpdateStatusDTO } from "@/application/dtos/admin/updateStatus.dto";
import { Role } from "@/domain/enums/role.enum";
import { container } from "@/infrastructure/di/inversify.di";
import { AdminController } from "@/presentation/http/controllers/admin.controller";
import { Request, Response, Router } from "express";
import { AuthGuard } from "../../middlewares/auth-guard.middlware";
import { validateDTO } from "../../middlewares/validate-dto.middlware";

const router = Router();
const adminController = container.get(AdminController);

router.get("/admin/users", AuthGuard([Role.ADMIN]), (req: Request, res: Response) => adminController.GetAllUser(req, res))
router.patch("/admin/users/:id/status", AuthGuard([Role.ADMIN]), validateDTO(UpdateStatusDTO), (req: Request, res: Response) => adminController.UpdateUserStatus(req, res))
router.get("/admin/projects", AuthGuard([Role.ADMIN]), (req: Request, res: Response) => adminController.getAllProjects(req, res))


export { router as adminRouter }
