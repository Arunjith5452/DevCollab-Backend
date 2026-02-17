import { container } from "@/infrastructure/di/inversify.di";
import { MeetingController } from "@/presentation/http/controllers/meeting.controller";
import { Request, Response, Router } from "express";
import { AuthGuard } from "../../middlewares/auth-guard.middlware";
import { Role } from "@/domain/enums/role.enum";
import { BlockGuard } from "../../middlewares/block-guard.middlware";

const router = Router();
const meetingController = container.get(MeetingController);

import { validateDTO } from "../../middlewares/validate-dto.middlware";
import { CreateMeetingDTO } from "@/application/dtos/meetings/create-meeting.dto";

const ALL_ROLES = [Role.ADMIN, Role.USER, Role.CREATOR, Role.CONTRIBUTER, Role.MAINTAINER];

router.post("/meetings", AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), validateDTO(CreateMeetingDTO), (req: Request, res: Response) => meetingController.scheduleMeeting(req, res));
router.get("/projects/:projectId/meetings", AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), (req: Request, res: Response) => meetingController.getProjectMeetings(req, res));
router.patch("/meetings/:meetingId/status", AuthGuard(ALL_ROLES), BlockGuard(ALL_ROLES), (req: Request, res: Response) => meetingController.updateMeetingStatus(req, res));

export { router as meetingRouter };
