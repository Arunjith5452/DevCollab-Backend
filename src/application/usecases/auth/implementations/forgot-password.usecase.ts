import { inject, injectable } from "inversify";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { EMAIL_TYPES } from "@/infrastructure/di/types/email";
import { forgotPasswordDTO } from "@/application/dtos/auth/forgotPassword.dto";
import { generateOTP } from "@/shared/utils/otp-generator.util";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { UserEntity } from "@/domain/entities/user.entity";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { IUserRepository } from "@/domain/repository/user.interface";
import { IEmailService } from "@/infrastructure/providers/interface/email.interface";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { ICacheService } from "@/application/interface/cache.service.interface";
import { logger } from "@/infrastructure/providers/logs/logger";

@injectable()
export class ForgotPasswordUseCase implements IExecute<forgotPasswordDTO, void> {

  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>,
    @inject(EMAIL_TYPES.EmailService) private readonly _emailService: IEmailService,
    @inject(COMMON_TYPES.CacheService) private readonly _cacheService: ICacheService
  ) { }

  async execute({ email }: forgotPasswordDTO): Promise<void> {

    try {

      const user = await this._userRepository.findByEmail(email);

      if (!user) throw new Error(ErrorMessage.USER_NOT_FOUND);

      const otp = generateOTP()
      const expiryTime = 3 * 60;

      await this._cacheService.set(
        `forgot-otp:${email}`,
        JSON.stringify({ otp }),
        'EX',
        expiryTime
      );

      console.log(`Forgot password OTP sent to ${email}: ${otp}`);
      await this._emailService.sendOtpEmail(email, otp, 3);

    } catch (error) {
      throw error

    }

  }



}

