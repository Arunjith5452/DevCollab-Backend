import { VerifyOtpDTO } from "@/application/dtos/auth/verifyOtp.dto";
import { inject, injectable } from "inversify";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { ICacheService } from "@/application/interface/cache.service.interface";
import { UserEntity } from "@/domain/entities/user.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { IUserRepository } from "@/domain/repository/user.interface";


@injectable()
export class VerifyOtpUseCase implements IExecute<VerifyOtpDTO, { message: string }> {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>,
        @inject(COMMON_TYPES.CacheService) private readonly _cacheService: ICacheService
    ) { }

    async execute({ token, otp }: VerifyOtpDTO): Promise<{ message: string }> {

        try {

            const tempUserJson = await this._cacheService.get(`otp:${token}`)

            if (!tempUserJson) throw new Error(ErrorMessage.OTP_EXPIRED)

            const tempUser = JSON.parse(tempUserJson)

            if (Number(tempUser.otp) !== Number(otp)) throw new Error(ErrorMessage.OTP_INVALID)

            const user = UserEntity.create({ email: tempUser.email, password: tempUser.password, role: tempUser.role, username: tempUser.name, id: tempUser.id, status: tempUser.status })
            const hashedPassword = await user.getHashedPassword()
            user.setPassword(hashedPassword)

            await this._userRepository.createUser(user)

            await this._cacheService.del(`otp:${token}`)


            return { message: "User verified and registered successfully" }

        } catch (error) {
            throw error
        }

    }

}
