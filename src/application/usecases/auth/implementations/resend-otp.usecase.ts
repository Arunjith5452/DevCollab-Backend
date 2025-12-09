import { redisClient } from "@/infrastructure/providers/redis/redis-client";
import { generateOTP } from "@/shared/utils/otp-generator.util";
import { sendOtpEmail } from "@/shared/utils/sent-otp.util";
import { ResendOtp } from "@/application/dtos/auth/resend.dto";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { injectable } from "inversify";


@injectable()
export class ResendOtpUseCase implements IExecute<ResendOtp, { message: string }> {

    async execute({ token }: ResendOtp): Promise<{ message: string }> {
        if (!token) throw new Error("Token is required");

        const tempUserJson = await redisClient.get(`otp:${token}`);
        if (!tempUserJson) throw new Error(ErrorMessage.OTP_EXPIRED);

        const tempUser = JSON.parse(tempUserJson);

        const newOtp = generateOTP();
        const expiryTime = 3 * 60

        await redisClient.setex(
            `otp:${token}`,
            expiryTime,
            JSON.stringify({
                ...tempUser,
                otp: newOtp,
            })
        );
        console.log(`Resent OTP for ${tempUser.email}:`, newOtp);

        await sendOtpEmail(tempUser.email, newOtp);


        return { message: "OTP resent successfully" };
    }
}
