import { VerifyOtpDTO } from "@/application/dtos/auth/verifyOtp.dto";
import { inject } from "inversify";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { redisClient } from "@/infrastructure/providers/redis/redis-client";
import { UserEntity } from "@/domain/entities/user.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { IExecute } from "@/application/interface/execute.usecase.interface";



export class VerifyOtpUseCase implements IExecute<VerifyOtpDTO,{message:string}> {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<UserEntity>
    ) { }

    async execute({ token, otp }: VerifyOtpDTO):Promise<{message:string}> {

        try {

         const tempUserJson = await redisClient.get(`otp:${token}`)

         if (!tempUserJson) throw new Error(ErrorMessage.OTP_EXPIRED)

            const tempUser = JSON.parse(tempUserJson)

            if (Number(tempUser.otp) !== Number(otp)) throw new Error(ErrorMessage.OTP_INVALID)

            const user = UserEntity.create({email:tempUser.email,password:tempUser.password,role:tempUser.role,username:tempUser.name,id:tempUser.id,status:tempUser.status})
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
