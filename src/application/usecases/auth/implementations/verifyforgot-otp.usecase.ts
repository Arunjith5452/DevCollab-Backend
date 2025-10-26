import { redisClient } from "@/infrastructure/providers/redis/redis-client";
import { VerifyForgotOtpDTO } from "@/application/dtos/auth/forgotOtp.dto";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { IExecute } from "@/application/interface/execute.usecase.interface";



export class VerifyForgotOtpUseCase implements IExecute<VerifyForgotOtpDTO, { message: string }> {

    async execute({ email, otp }: VerifyForgotOtpDTO): Promise<{ message: string }> {

        try {

            const storedOtpJson = await redisClient.get(`forgot-otp:${email}`);
            if (!storedOtpJson) throw new Error(ErrorMessage.OTP_EXPIRED);

            const { otp: storedOtp } = JSON.parse(storedOtpJson);

            if (Number(storedOtp) !== Number(otp)) throw new Error(ErrorMessage.OTP_INVALID);

            await redisClient.del(`forgot-otp:${email}`);

            return { message: "OTP verified successfully" };

        } catch (error) {
            throw error
        }

    }
}
