import { VerifyOtpDTO } from "@/application/dtos/auth/verifyOtp.dto";
import { inject } from "inversify";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { redisClient } from "@/infrastructure/redis/redis-client";
import { UserEntity } from "@/domain/entities/user.entity";
import { IExecute } from "../interfaces/execute-usecase.interface";
import { IUser } from "@/infrastructure/db/interface/user.inteface";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";





export class VerifyOtpUseCase implements IExecute<VerifyOtpDTO,{message:string}> {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<IUser>
    ) { }

    async execute({ token, otp }: VerifyOtpDTO):Promise<{message:string}> {

        try {

         const tempUserJson = await redisClient.get(`otp:${token}`)
          console.log("backine token",tempUserJson)
            if (!tempUserJson) throw new Error(ErrorMessage.OTP_EXPIRED)

            const tempUser = JSON.parse(tempUserJson)

            if (Number(tempUser.otp) !== Number(otp)) throw new Error(ErrorMessage.OTP_INVALID)

            const user = new UserEntity(tempUser.name, tempUser.email, tempUser.password)
            const hashedPassword = await user.getHashedPassword()
            user.setPassword(hashedPassword)

             await this._userRepository.createUser(user)

            await redisClient.del(`otp:${token}`)


            return { message: "User verified and registered successfully" }

        } catch (error) {
            throw error
        }

    }

}
