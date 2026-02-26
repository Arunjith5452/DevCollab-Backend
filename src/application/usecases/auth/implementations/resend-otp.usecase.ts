import { generateOTP } from "@/shared/utils/otp-generator.util";
import { ResendOtp } from "@/application/dtos/auth/resend.dto";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { inject, injectable } from "inversify";
import { EMAIL_TYPES } from "@/infrastructure/di/types/email";
import { IEmailService } from "@/infrastructure/providers/interface/email.interface";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { ICacheService } from "@/application/interface/cache.service.interface";
import { logger } from "@/infrastructure/providers/logs/logger";


@injectable()
export class ResendOtpUseCase implements IExecute<ResendOtp, { message: string }> {

    constructor(
        @inject(EMAIL_TYPES.EmailService) private readonly _emailService: IEmailService,
        @inject(COMMON_TYPES.CacheService) private readonly _cacheService: ICacheService
    ) { }

    async execute({ token }: ResendOtp): Promise<{ message: string }> {
        if (!token) throw new Error("Token is required");

        const tempUserJson = await this._cacheService.get(`otp:${token}`);
        if (!tempUserJson) throw new Error(ErrorMessage.OTP_EXPIRED);

        const tempUser = JSON.parse(tempUserJson);

        const newOtp = generateOTP();
        const expiryTime = 3 * 60

        await this._cacheService.set(
            `otp:${token}`,
            JSON.stringify({
                ...tempUser,
                otp: newOtp,
            }),
            'EX',
            expiryTime
        );
        logger.info(`Resent OTP for ${tempUser.email}: ${newOtp}`);

        await this._emailService.sendOtpEmail(tempUser.email, newOtp, 3);


        return { message: "OTP resent successfully" };
    }
}
