import { inject } from "inversify";
import { IExecute } from "../interfaces/execute-usecase.interface";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { IUser } from "@/infrastructure/db/interface/user.inteface";
import { forgotPasswordDTO } from "@/application/dtos/auth/forgotPassword.dto";
import { generateOTP } from "@/shared/utils/otp-generator.util";
import { redisClient } from "@/infrastructure/redis/redis-client";
import { sendOtpEmail } from "@/shared/utils/sent-otp.util";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";

export class ForgotPasswordUseCase implements IExecute<forgotPasswordDTO, void> {

  constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<IUser>) { }

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

