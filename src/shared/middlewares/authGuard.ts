import { Request, Response, NextFunction } from 'express';
import { verifyToken } from "../utils/jwt.util";
import { ClientErrorStatus } from '@/domain/enums/status-codes/client-error-status.enum'
import { ServerErrorStatus } from '@/domain/enums/status-codes/server-error-status.enum'
import { logger } from '@/infrastructure/providers/logs/logger';

export const AuthGuard = (roles:Array<string>)=>(req: Request, res: Response, next: NextFunction) => {

    try {

        const token = req.cookies?.accessToken

        if (!token) {
            return res.status(ClientErrorStatus.UNAUTHORIZED).json({ success: false, message: "Token missing" })
        }

        const verify = verifyToken(token, "access") as { email: string, userId: string, role:string}

        if (!verify) {
            return res.status(ClientErrorStatus.UNAUTHORIZED).json({ success: false, message: "Decode token failed" })
        }

        if(!roles.includes(verify.role)){
            return res.status(ClientErrorStatus.FORBIDDEN).json({success:false,message:"You can't access this path"})
        }

        req.user = verify 

        next();

    } catch (error) {
        logger.error("authGuard",error)
        return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({ message: "Unauthorized" });
    }

}