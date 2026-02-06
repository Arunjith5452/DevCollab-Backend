import { RegisterDTO } from "@/application/dtos/auth/register.dto"
import { inject, injectable } from "inversify"
import { USER_TYPES } from "@/infrastructure/di/types/user"
import { EMAIL_TYPES } from "@/infrastructure/di/types/email"
import { generateOTP } from "@/shared/utils/otp-generator.util"
import { randomBytes } from "crypto"
import { validateEmail } from "@/shared/utils/email-validate.util"
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum"
import { UserEntity } from "@/domain/entities/user.entity"
import { IExecute } from "@/application/interface/execute.usecase.interface"
import { IUserRepository } from "@/domain/repository/user.interface"
import { IEmailService } from "@/infrastructure/providers/interface/email.interface"
import { COMMON_TYPES } from "@/infrastructure/di/types/common"
import { ICacheService } from "@/application/interface/cache.service.interface"

@injectable()
export class RegiserUseCase implements IExecute<RegisterDTO, { token: string }> {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>,
        @inject(EMAIL_TYPES.EmailService) private readonly _emailService: IEmailService,
        @inject(COMMON_TYPES.CacheService) private readonly _cacheService: ICacheService
    ) { }

    async execute({ name, email, password }: RegisterDTO): Promise<{ token: string }> {

        try {
            const isValidEmail = await validateEmail(email)

            if (!isValidEmail) {
                throw new Error(ErrorMessage.EMAIL_INVALID)
            }

            const existingUser = await this._userRepository.findByEmail(email)
            if (existingUser) throw new Error(ErrorMessage.EMAIL_ALREADY_EXISTS)

            const otp = generateOTP()
            const expiryTime = 3 * 60

            // Generate a secure random token
            const token = randomBytes(32).toString("hex")

            await this._cacheService.set(`otp:${token}`, JSON.stringify({
                name,
                email,
                password,
                otp
            }), 'EX', expiryTime)

            await this._emailService.sendOtpEmail(email, otp, 3);

            console.log(`OTP for ${email}:`, otp)

            return { token }

        } catch (error) {
            throw error
        }

    }

}