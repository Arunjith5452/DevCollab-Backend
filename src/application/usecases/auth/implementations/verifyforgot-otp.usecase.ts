import { VerifyForgotOtpDTO } from "@/application/dtos/auth/forgotOtp.dto";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { inject, injectable } from "inversify";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { ICacheService } from "@/application/interface/cache.service.interface";


@injectable()
export class VerifyForgotOtpUseCase implements IExecute<VerifyForgotOtpDTO, { message: string }> {

    constructor(@inject(COMMON_TYPES.CacheService) private readonly _cacheService: ICacheService) { }

    async execute({ email, otp }: VerifyForgotOtpDTO): Promise<{ message: string }> {

        try {

            const storedOtpJson = await this._cacheService.get(`forgot-otp:${email}`);
            if (!storedOtpJson) throw new Error(ErrorMessage.OTP_EXPIRED);

            const { otp: storedOtp } = JSON.parse(storedOtpJson);

            if (Number(storedOtp) !== Number(otp)) throw new Error(ErrorMessage.OTP_INVALID);

            await this._cacheService.del(`forgot-otp:${email}`);

            return { message: "OTP verified successfully" };

        } catch (error) {
            throw error
        }

    }
}
