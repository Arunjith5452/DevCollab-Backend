import { Request, Response, NextFunction } from 'express';
import { verifyToken } from "../utils/jwt.util";
import { ClientErrorStatus } from '@/domain/enums/status-codes/client-error-status.enum'
import { ServerErrorStatus } from '@/domain/enums/status-codes/server-error-status.enum'

export const AuthGuard = (req: Request, res: Response, next: NextFunction) => {

    try {

        const token = req.cookies?.accessToken

        if (!token) {
            return res.status(ClientErrorStatus.UNAUTHORIZED).json({ success: false, message: "Token missing" })
        }

        const verify = verifyToken(token, "access")

        if (!verify) {
            return res.status(ClientErrorStatus.UNAUTHORIZED).json({ success: false, message: "Decode token failed" })
        }

        req.user = verify as { email: string, userId: string }

        next();

    } catch (error) {
        return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({ message: "Unauthorized" });
    }

}