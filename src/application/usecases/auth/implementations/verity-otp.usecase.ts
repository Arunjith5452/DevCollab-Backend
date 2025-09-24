import { VerifyOtpDTO } from "@/application/dtos/auth/verifyOtp.dto";
import { inject } from "inversify";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { redisClient } from "@/infrastructure/redis/redis-client";
import { UserEntity } from "@/domain/entities/user.entity";
import { IExecute } from "../interfaces/execute-usecase.interface";
import { IUser } from "@/infrastructure/db/interface/user.inteface";
import { VerifyOtpResult } from "@/domain/types/auth";





export class VerifyOtpUseCase implements IExecute<VerifyOtpDTO,VerifyOtpResult> {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<IUser>
    ) { }

    async execute({ token, otp }: VerifyOtpDTO):Promise<VerifyOtpResult> {

        try {

        const tempUserJson = await redisClient.get(`otp:${token}`)
        console.log("backine token",tempUserJson)
            if (!tempUserJson) throw new Error("OTP expired or not found")

            const tempUser = JSON.parse(tempUserJson)

            if (Number(tempUser.otp) !== Number(otp)) throw new Error("Invalid OTP")

            const user = new UserEntity(tempUser.name, tempUser.email, tempUser.password)
            const hashedPassword = await user.getHashedPassword()
            user.setPassword(hashedPassword)

            const createdUser = await this._userRepository.createUser(user)

            await redisClient.del(`otp:${token}`)

            return { message: "User verified and registered successfully", user: createdUser }

        } catch (error) {
            throw error
        }

    }

}
