import { IExecute } from "../interfaces/execute-usecase.interface";
import { RefreshResult } from "@/domain/types/auth/refresh.types";
import { inject, injectable } from "inversify";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { IUser } from "@/infrastructure/db/interface/user.inteface";
import { generateAccessToken, verifyToken } from "@/shared/utils/jwt.util";
import { redisClient } from "@/infrastructure/redis/redis-client";

@injectable()
export class RefreshTokenUseCase implements IExecute<string, RefreshResult> {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<IUser>,
        
    ) { }

    async execute(refreshToken:string): Promise<RefreshResult> {

        try {
            if (!refreshToken) throw new Error("Refresh token is missing")

            const decoded:any = verifyToken(refreshToken, "refresh")
            if (!decoded) throw new Error("Invalid or expired refresh token")

            const storedToken = await redisClient.get(`refresh:${decoded.email}`)
            if (!storedToken || storedToken !== refreshToken) {
                throw new Error("Refrsh token not found or already revoked")
            }

            const user = await this._userRepository.findByEmail(decoded.emai);
            if (!user) throw new Error("User not found");

            const newAccessToken = generateAccessToken({ userId: user._id.toString(), email: user.email })

            return {
                accessToken: newAccessToken,
                message: "Access token refreshed successfully",
            }

        } catch (error) {
            throw error
        }

    }

}