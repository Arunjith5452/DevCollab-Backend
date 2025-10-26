import { Role } from "@/domain/enums/role.enum";
import { AuthGuard } from "@/shared/middlewares/authGuard";
import { Router } from "express"
const router = Router();


router.get("/profile/me",AuthGuard([Role.ADMIN,Role.USER]),(req,res)=>{
  res.json({ cookies: req.cookies });

})

export { router as profileRouter }                           