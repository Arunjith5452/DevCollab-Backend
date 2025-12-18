import { container } from "@/infrastructure/di/inversify.di";
import { TaskController } from "@/presentation/http/controllers/task.controller";
import { Request, Response, Router } from "express";
import { AuthGuard } from "../../middlewares/auth-guard.middlware";
import { Role } from "@/domain/enums/role.enum";
import { BlockGuard } from "../../middlewares/block-guard.middlware";
import { validateDTO } from "../../middlewares/validate-dto.middlware";
import { CreateTaskDTO } from "@/application/dtos/tasks/create-task.dto";
import { SubmitWorkDTO } from "@/application/dtos/tasks/submit-work.dto";
import { RequestImprovementDTO } from "@/application/dtos/tasks/request-improvement.dto";


const router = Router()


const taskController = container.get(TaskController)


router.post("/task", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), validateDTO(CreateTaskDTO), (req: Request, res: Response) => taskController.createTask(req, res))
router.get("/task", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), (req: Request, res: Response) => taskController.getCreatorTasks(req, res))
router.get("/project/:projectId/tasks/:status", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), (req: Request, res: Response) => taskController.getContributerTasks(req, res))
router.get("/task/assignees/:projectId", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), (req: Request, res: Response) => taskController.getProjectAssignee(req, res))
router.patch("/tasks/:taskId/comment", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), (req: Request, res: Response) => taskController.addComment(req, res))
router.patch("/tasks/:taskId/start", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), (req: Request, res: Response) => taskController.startTask(req, res))
router.patch("/tasks/:taskId/done", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), validateDTO(SubmitWorkDTO), (req: Request, res: Response) => taskController.submitTask(req, res))
router.patch("/tasks/:taskId/request-improvement", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), validateDTO(RequestImprovementDTO), (req: Request, res: Response) => taskController.requestImprovement(req, res))
router.patch("/tasks/:taskId/approve", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), (req: Request, res: Response) => taskController.approveTask(req, res))

export { router as taskRouter }