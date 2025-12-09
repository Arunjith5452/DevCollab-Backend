import { LogoutDTO } from "@/application/dtos/auth/logout.dto";
import { inject, injectable } from "inversify";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { verifyToken } from "@/shared/utils/jwt.util";
import { redisClient } from "@/infrastructure/providers/redis/redis-client";
import { UserEntity } from "@/domain/entities/user.entity";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { IUserRepository } from "@/infrastructure/db/repository/interface/user.interface";


@injectable()
export class LogoutUseCase implements IExecute<LogoutDTO, void> {

    constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>) { }

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