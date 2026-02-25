import { Role } from "@/domain/enums/role.enum";
import { container } from "@/infrastructure/di/inversify.di";
import { PLAN_TYPES } from "@/infrastructure/di/types/plan";
import { PlanController } from "@/presentation/http/controllers/plan.controller";
import { Request, Response, Router } from "express";
import { AuthGuard } from "../../middlewares/auth-guard.middlware";

const router = Router();
const planController = container.get<PlanController>(PLAN_TYPES.PlanController);

router.get("/plans", (req: Request, res: Response) => planController.getActivePlans(req, res));

router.post("/admin/plans", AuthGuard([Role.ADMIN]), (req: Request, res: Response) => planController.createPlan(req, res));
router.get("/admin/plans", AuthGuard([Role.ADMIN]), (req: Request, res: Response) => planController.getAllPlans(req, res));
router.put("/admin/plans/:id", AuthGuard([Role.ADMIN]), (req: Request, res: Response) => planController.editPlan(req, res));
router.patch("/admin/plans/:id/status", AuthGuard([Role.ADMIN]), (req: Request, res: Response) => planController.togglePlanStatus(req, res));

export { router as planRouter };
