import { inject, injectable } from "inversify";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { forgotPasswordDTO } from "@/application/dtos/auth/forgotPassword.dto";
import { generateOTP } from "@/shared/utils/otp-generator.util";
import { redisClient } from "@/infrastructure/providers/redis/redis-client";
import { sendOtpEmail } from "@/shared/utils/sent-otp.util";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { UserEntity } from "@/domain/entities/user.entity";
import { IExecute } from "@/application/interface/execute.usecase.interface";

@injectable()
export class ForgotPasswordUseCase implements IExecute<forgotPasswordDTO, void> {

  constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<UserEntity  >) { }

  async execute({ email }: forgotPasswordDTO): Promise<void> {

    try {

      const user = await this._userRepository.findByEmail(email);

      if (!user) throw new Error(ErrorMessage.USER_NOT_FOUND);

      const otp = generateOTP()
      const expiryTime = 3 * 60;

      await redisClient.setex(
        `forgot-otp:${email}`,
        expiryTime,
        JSON.stringify({ otp })
      );

      console.log(`Forgot password OTP sent to ${email}:`, otp);
      await sendOtpEmail(email, otp);

    } catch (error) {
      throw error

    }

  }



}

