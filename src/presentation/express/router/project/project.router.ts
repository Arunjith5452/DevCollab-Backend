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


const ALL_ROLES = [Role.ADMIN, Role.USER, Role.CREATOR, Role.CONTRIBUTER, Role.MAINTAINER];

router.get('/platform/stats', (req: Request, res: Response) => projectController.getPlatformStats(req, res))
router.get('/projects/featured', (req: Request, res: Response) => projectController.getFeaturedProjects(req, res))

router.post("/projects", AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), validateDTO(CreateProjectDTO), (req: Request, res: Response) => projectController.createProject(req, res))
router.get("/projects", AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), (req: Request, res: Response) => projectController.getAllProjects(req, res))
router.get("/projects/:projectId", AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), (req: Request, res: Response) => projectController.projectDetails(req, res))
router.post("/projects/:projectId/apply", AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), validateDTO(ApplyToProjectDTO), (req: Request, res: Response) => projectController.applyToProject(req, res))
router.get("/projects/:projectId/applications", AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), (req: Request, res: Response) => projectController.getPendingApplication(req, res))
router.post("/application/:applicationId/approve/:projectId", AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), (req: Request, res: Response) => projectController.approveApplication(req, res))
router.post("/application/:applicationId/reject", AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), (req: Request, res: Response) => projectController.rejectApplication(req, res))
router.get('/user/projects/created', AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), (req: Request, res: Response) => projectController.getMyCreatedProject(req, res))
router.get('/user/projects/applied', AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), (req: Request, res: Response) => projectController.getMyAppliedProject(req, res))
router.get('/projects/:projectId/members', AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), (req: Request, res: Response) => projectController.getProjectMember(req, res))
router.patch('/projects/:projectId/disable', AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), (req: Request, res: Response) => projectController.disableProject(req, res))
router.get('/projects/:projectId/edit', AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), (req: Request, res: Response) => projectController.getProjectForEdit(req, res))
router.patch('/projects/:projectId/edit', AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), validateDTO(UpdateProjectDTO), (req: Request, res: Response) => projectController.editProject(req, res))
router.get('/projects/:projectId/stats', AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), (req: Request, res: Response) => projectController.getProjectStats(req, res))
router.get('/projects/:projectId/contributor-stats', AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), (req: Request, res: Response) => projectController.getContributorStats(req, res))
router.get('/projects/:projectId/ai-suggestions', AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), (req: Request, res: Response) => projectController.getAiSuggestions(req, res))


export { router as projectRouter }