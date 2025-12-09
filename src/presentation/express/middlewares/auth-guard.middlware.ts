import { Request, Response, NextFunction } from 'express';
import { ClientErrorStatus } from '@/domain/enums/status-codes/client-error-status.enum'
import { ServerErrorStatus } from '@/domain/enums/status-codes/server-error-status.enum'
import { verifyToken } from '@/shared/utils/jwt.util';

export const AuthGuard = (roles: Array<string>) => (req: Request, res: Response, next: NextFunction) => {

    try {

        console.log(":jasdgasdfsad")


        const token = req.cookies?.accessToken
        console.log("token", token)

        if (!token) {
            console.log("tokeninside", token)
            return res.status(ClientErrorStatus.UNAUTHORIZED).json({ success: false, message: "Token missing" })
        }

        const verify = verifyToken(token, "access") as { email: string, userId: string, role: string, username: string }

        if (!verify) {
            return res.status(ClientErrorStatus.UNAUTHORIZED).json({ success: false, message: "Decode token failed" })
        }

        const userRoles = Array.isArray(verify.role) ? verify.role : [verify.role]
        const hasPermission = userRoles.some((r) => roles.includes(r))

        if (!hasPermission) {
            return res.status(ClientErrorStatus.FORBIDDEN).json({ success: false, message: "You can't access this path" })
        }

        req.user = verify

        next();

    } catch (error) {
        return res.status(ServerErrorStatus.INTERNAL_SERVER_ERROR).json({ message: "Unauthorized" });
    }

}