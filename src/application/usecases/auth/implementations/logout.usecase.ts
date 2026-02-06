import { verifyToken } from "@/shared/utils/jwt.util";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { JwtPayload } from "jsonwebtoken";
import { inject, injectable } from "inversify";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { ICacheService } from "@/application/interface/cache.service.interface";

@injectable()
export class LogoutUseCase implements IExecute<string, void> {
    constructor(@inject(COMMON_TYPES.CacheService) private _cacheService: ICacheService) { }

    async execute(refreshToken: string): Promise<void> {

        try {

            if (!refreshToken) throw new Error("Refresh token missing")

            const decoded = verifyToken(refreshToken, "refresh") as JwtPayload | string | null;

            if (!decoded) throw new Error("Invalid or expired refresh token")

            if (typeof decoded === 'object' && 'email' in decoded) {
                await this._cacheService.del(`refresh:${decoded.email}`)
            }

            console.log("Logout successfully")

        } catch (error) {
            throw error
        }

    }

}