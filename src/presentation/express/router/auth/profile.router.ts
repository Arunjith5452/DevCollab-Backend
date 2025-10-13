import { AuthGuard } from "@/shared/middlewares/authGuard";
import { Router } from "express"
const router = Router();


router.get("/profile/me",AuthGuard,(req,res)=>{

     console.log(req.cookies);
  res.json({ cookies: req.cookies });

})

export { router as profileRouter }                           