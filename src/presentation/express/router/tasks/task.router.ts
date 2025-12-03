import { container } from "@/infrastructure/di/inversify.di";
import { TaskController } from "@/presentation/http/controllers/task.controller";
import { Request, Response, Router } from "express";
import { AuthGuard } from "../../middlewares/auth-guard.middlware";
import { Role } from "@/domain/enums/role.enum";
import { BlockGuard } from "../../middlewares/block-guard.middlware";
import { validateDTO } from "../../middlewares/validate-dto.middlware";
import { CreateTaskDTO } from "@/application/dtos/tasks/create-task.dto";


const router = Router()


const taskController = container.get(TaskController)


router.post("/task", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), validateDTO(CreateTaskDTO), (req: Request, res: Response) => taskController.createTask(req, res))


export { router as taskRouter }