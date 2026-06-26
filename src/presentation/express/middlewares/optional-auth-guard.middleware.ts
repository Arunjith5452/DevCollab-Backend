import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/shared/utils/jwt.util';

export const OptionalAuthGuard = () => (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken;

        if (token) {
            const verify = verifyToken(token, "access") as { email: string, userId: string, role: string, name: string, profileImage: string };

            if (verify) {
                req.user = {
                    ...verify,
                    username: verify.name || ""
                };
            }
        }
    } catch {
        // Ignore errors to allow unauthenticated access
    } finally {
        next();
    }
};
