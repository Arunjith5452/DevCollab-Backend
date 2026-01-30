import { Router } from "express";
import { authRouter } from "./auth/auth.router";
import { profileRouter } from "./auth/profile.router";
import { adminRouter } from "./admin/admin.router";
import { projectRouter } from "./project/project.router";
import { s3Router } from "./user/file.router";
import { userRouter } from "./user/user.router";
import { taskRouter } from "./tasks/task.router";
import { paymentRouter } from "./payment/payment.router";
import { meetingRouter } from "./meetings/meeting.router";

const router = Router();

router.use(adminRouter);
router.use(userRouter);
router.use(authRouter);
router.use(s3Router);
router.use(profileRouter);
router.use(projectRouter);
router.use(taskRouter);
router.use(paymentRouter);
router.use(meetingRouter);


export const appRouter = router;
