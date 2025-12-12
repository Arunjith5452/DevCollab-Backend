import { verifyToken } from "@/shared/utils/jwt.util";
import { redisClient } from "@/infrastructure/providers/redis/redis-client";
import { IExecute } from "@/application/interface/execute.usecase.interface";


export class LogoutUseCase implements IExecute<string , void> {
    constructor() { }

    async execute(refreshToken: string): Promise<void> {

        try {
            console.log("reaching thie usecase")

            if (!refreshToken) throw new Error("Refresh token missing")

            console.log("refreshTolken", refreshToken)

            const decoded: any = verifyToken(refreshToken, "refresh")

            console.log("decoded", decoded)

            if (!decoded) throw new Error("Invalid or expired refresh token")

            await redisClient.del(`refresh:${decoded.email}`)

            console.log("Logout successfully")

        } catch (error) {
            throw error
        }

    }

}