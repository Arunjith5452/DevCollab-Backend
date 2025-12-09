import { RefreshResult } from "@/domain/types/auth/refresh.types";
import { inject, injectable } from "inversify";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { generateAccessToken, verifyToken } from "@/shared/utils/jwt.util";
import { redisClient } from "@/infrastructure/providers/redis/redis-client";
import { UserEntity } from "@/domain/entities/user.entity";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { Status } from "@/domain/enums/status.enums";

@injectable()
export class RefreshTokenUseCase implements IExecute<string, RefreshResult> {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<UserEntity>,

    ) { }

    async execute(refreshToken: string): Promise<RefreshResult> {

        try {
            if (!refreshToken) throw new Error("Refresh token is missing")

            const decoded: any = verifyToken(refreshToken, "refresh")

            if (!decoded) throw new Error("Invalid or expired refresh token")

            const storedToken = await redisClient.get(`refresh:${decoded.email}`)
            if (!storedToken || storedToken !== refreshToken) {
                throw new Error("Refrsh token not found or already revoked")
            }

            const user = await this._userRepository.findByEmail(decoded.email);
            if (!user) throw new Error("User not found");


            if(user.status === Status.BLOCK){
                throw new Error("Admin blocked please try again")
            }

            const newAccessToken = generateAccessToken({ userId: user.id!.toString(), name: user.username, email: user.email, role: user.role })

            return {
                accessToken: newAccessToken,
                message: "Access token refreshed successfully",
            }

        } catch (error) {
            throw error
        }

    }

}