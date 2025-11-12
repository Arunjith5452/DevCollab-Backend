import { CreateProjectDTO } from "@/application/dtos/project/createProject.dto";
import { Role } from "@/domain/enums/role.enum";
import { container } from "@/infrastructure/di/inversify.di";
import { ProjectController } from "@/presentation/http/controllers/project.controller";
import { Request, Response, Router } from "express";
import { AuthGuard } from "../../middlewares/auth-guard.middlware";
import { validateDTO } from "../../middlewares/validate-dto.middlware";

const router = Router();




const projectController = container.get(ProjectController)


router.post("/users/projects",AuthGuard([Role.ADMIN,Role.USER]),validateDTO(CreateProjectDTO), (req: Request, res: Response) => projectController.createProject(req, res))
router.get("/users/projects",(req : Request, res:Response)=>projectController.getAllProjects(req,res))
router.get("/users/projects/:projectId",(req:Request,res:Response)=>projectController.projectDetails(req,res))


export { router as projectRouter }