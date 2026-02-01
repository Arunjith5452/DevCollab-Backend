import { redisClient } from "@/infrastructure/providers/redis/redis-client";
import { generateOTP } from "@/shared/utils/otp-generator.util";
import { ResendOtp } from "@/application/dtos/auth/resend.dto";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { inject, injectable } from "inversify";
import { EMAIL_TYPES } from "@/infrastructure/di/types/email";
import { IEmailService } from "@/infrastructure/providers/interface/email.interface";


@injectable()
export class ResendOtpUseCase implements IExecute<ResendOtp, { message: string }> {

    constructor(
        @inject(EMAIL_TYPES.EmailService) private readonly _emailService: IEmailService
    ) { }

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

        await this._emailService.sendOtpEmail(tempUser.email, newOtp, 3);


        return { message: "OTP resent successfully" };
    }
}
