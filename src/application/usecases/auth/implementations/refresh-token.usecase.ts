import { RefreshResult } from "@/domain/types/auth/refresh.types";
import { inject, injectable } from "inversify";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { generateAccessToken, verifyToken } from "@/shared/utils/jwt.util";
import { UserEntity } from "@/domain/entities/user.entity";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { Status } from "@/domain/enums/status.enums";
import { IUserRepository } from "@/domain/repository/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { ICacheService } from "@/application/interface/cache.service.interface";

@injectable()
export class RefreshTokenUseCase implements IExecute<string, RefreshResult> {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>,
        @inject(COMMON_TYPES.CacheService) private readonly _cacheService: ICacheService
    ) { }

    async execute(refreshToken: string): Promise<RefreshResult> {

        try {
            if (!refreshToken) throw new Error("Refresh token is missing")

            const decoded = verifyToken(refreshToken, "refresh") as JwtPayload | string | null;

            if (!decoded) throw new Error("Invalid or expired refresh token")

            let email: string;
            if (typeof decoded === 'object' && 'email' in decoded) {
                email = decoded.email;
            } else {
                throw new Error("Invalid token payload");
            }

            const storedToken = await this._cacheService.get(`refresh:${email}`)
            if (!storedToken || storedToken !== refreshToken) {
                throw new Error("Refrsh token not found or already revoked")
            }

            const user = await this._userRepository.findByEmail(email);
            if (!user) throw new Error("User not found");


            if (user.status === Status.BLOCK) {
                throw new Error("Admin blocked please try again")
            }

            const newAccessToken = generateAccessToken({ userId: user.id ? user.id.toString() : "", name: user.username, email: user.email, role: user.role })

            return {
                accessToken: newAccessToken,
                message: "Access token refreshed successfully",
            }

        } catch (error) {
            throw error
        }

    }

}