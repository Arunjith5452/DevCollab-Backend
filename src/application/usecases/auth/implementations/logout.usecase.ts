import { LogoutDTO } from "@/application/dtos/auth/logout.dto";
import { IExecute } from "../interfaces/execute-usecase.interface";
import { inject } from "inversify";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { IUser } from "@/infrastructure/db/interface/user.inteface";
import { verifyToken } from "@/shared/utils/jwt.util";
import { redisClient } from "@/infrastructure/redis/redis-client";



export class LogoutUseCase implements IExecute<LogoutDTO, void> {

    constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<IUser>) { }

    async execute({ refreshToken }: LogoutDTO): Promise<void> {

        try {

            if (!refreshToken) throw new Error("Refresh token missing")

            if (!refreshToken) throw new Error("Refresh token missing")

            const decoded: any = verifyToken(refreshToken, "refresh")

            if (!decoded) throw new Error("Invalid or expired refresh token")

            await redisClient.del(`refresh:${decoded.email}`)

            console.log("Logout successfully")

        } catch (error) {
          throw error
        }

    }

}