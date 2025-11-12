import { Role } from "@/domain/enums/role.enum";
import { Router } from "express"
import { AuthGuard } from "../../middlewares/auth-guard.middlware";
import { BlockGuard } from "../../middlewares/block-guard.middlware";
const router = Router();


router.get("/profile/me",AuthGuard([Role.ADMIN,Role.USER,Role.CREATOR,Role.CONTRIBUTER]),BlockGuard([Role.USER,Role.CREATOR,Role.CONTRIBUTER,Role.MAINTAINER]),(req,res)=>{
  res.json({ cookies: req.cookies });

})

export { router as profileRouter }                           