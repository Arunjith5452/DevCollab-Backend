import { RegisterDTO } from "@/application/dtos/auth/register.dto"
import { validateEmail } from "@/shared/utils/email-validate.util"
import { inject, injectable } from "inversify"
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface"
import { IUser } from "@/infrastructure/db/interface/user.inteface"
import { USER_TYPES } from "@/infrastructure/di/types/user"
import { generateOTP } from "@/shared/utils/otp-generator.util"
import { redisClient } from "@/infrastructure/redis/redis-client"
import { sendOtpEmail } from "@/shared/utils/sent-otp.util"
import { IExecute } from "../interfaces/execute-usecase.interface"
import { randomBytes } from "crypto"

@injectable()
export class RegiserUseCase implements IExecute<RegisterDTO,{token:string}> {

    constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository:IUserRepositor<IUser>){}

    async execute({ name,email,password }: RegisterDTO): Promise<{token:string}> {

        try {
            const isValidEmail = await validateEmail(email)

            if (!isValidEmail) {
                throw new Error("Email is not valid")
            }

            const existingUser = await this._userRepository.getUserByEmail(email)
            if (existingUser) throw new Error("Email already registered")

            const otp = generateOTP()
            const expiryTime = 3 * 60

            // Generate a secure random token
            const token = randomBytes(32).toString("hex")

           await redisClient.setex(`otp:${token}`, expiryTime, JSON.stringify({
                name,
                email,
                password,
                otp
            }))

            await sendOtpEmail(email,otp)

            console.log(`OTP for ${email}:`,otp)

            return {token}

        } catch (error) {
            throw error
        }


    }

}