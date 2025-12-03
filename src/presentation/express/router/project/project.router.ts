import { Role } from "@/domain/enums/role.enum";
import { container } from "@/infrastructure/di/inversify.di";
import { ProjectController } from "@/presentation/http/controllers/project.controller";
import { Request, Response, Router } from "express";
import { AuthGuard } from "../../middlewares/auth-guard.middlware";
import { validateDTO } from "../../middlewares/validate-dto.middlware";
import { ApplyToProjectDTO } from "@/application/dtos/project/apply-project.dto";
import { CreateProjectDTO } from "@/application/dtos/project/createProject.dto";
import { BlockGuard } from "../../middlewares/block-guard.middlware";
import { UpdateProjectDTO } from "@/application/dtos/project/edit-project.dto";


const router = Router();


const projectController = container.get(ProjectController)


router.post("/projects", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), validateDTO(CreateProjectDTO), (req: Request, res: Response) => projectController.createProject(req, res))
router.get("/projects", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), (req: Request, res: Response) => projectController.getAllProjects(req, res))
router.get("/projects/:projectId", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), (req: Request, res: Response) => projectController.projectDetails(req, res))
router.post("/projects/:projectId/apply", AuthGuard([Role.USER, Role.ADMIN]), BlockGuard([Role.USER]), validateDTO(ApplyToProjectDTO), (req: Request, res: Response) => projectController.applyToProject(req, res))
router.get("/projects/:projectId/applications", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), (req: Request, res: Response) => projectController.getPendingApplication(req, res))
router.post("/application/:applicationId/approve/:projectId", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), (req: Request, res: Response) => projectController.approveApplication(req, res))
router.post("/application/:applicationId/reject", AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), (req: Request, res: Response) => projectController.rejectApplication(req, res))
router.get('/user/projects/created', AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), (req: Request, res: Response) => projectController.getMyCreatedProject(req, res))
router.get('/user/projects/applied', AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), (req: Request, res: Response) => projectController.getMyAppliedProject(req, res))
router.get('/projects/:projectId/edit', AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), (req: Request, res: Response) => projectController.getProjectForEdit(req, res))
router.patch('/projects/:projectId/edit', AuthGuard([Role.ADMIN, Role.USER]), BlockGuard([Role.USER]), validateDTO(UpdateProjectDTO), (req: Request, res: Response) => projectController.editProject(req, res))


export { router as projectRouter }