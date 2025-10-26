import { inject, injectable } from "inversify";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { LoginDTO } from "@/application/dtos/auth/login.dto";
import { validateEmail } from "@/shared/utils/email-validate.util";
import { verify } from "@/shared/utils/password-hash.utils";
import { generateAccessToken, generateRefreshToken } from "@/shared/utils/jwt.util";
import { redisClient } from "@/infrastructure/providers/redis/redis-client";
import { AuthResult } from "@/domain/types/auth";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { SuccessMessage } from "@/domain/enums/messages/success-message.enum";
import { UserEntity } from "@/domain/entities/user.entity";
import { IExecute } from "@/application/interface/execute.usecase.interface";


@injectable()
export class LoginUseCase implements IExecute<LoginDTO, AuthResult> {
    constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<UserEntity>) { }

    async execute({ email, password }: LoginDTO): Promise<AuthResult> {

        try {

            const isValidEmail = await validateEmail(email)

            if (!isValidEmail) throw new Error(ErrorMessage.EMAIL_INVALID)

        

            const user = await this._userRepository.findByEmail(email)
        
            if (!user) throw new Error(ErrorMessage.EMAIL_NOT_EXIST)

                if(user.status == 'block'){
                    throw new Error(ErrorMessage.FORBIDDEN)
                }

            const isPassword = await verify(user.password, password)

            if (!isPassword) throw new Error(ErrorMessage.INVALID_PASSWORD);

            const payload = { userId: user.id, email: user.email,role:user.role }

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            await redisClient.set(`refresh:${user.email}`, refreshToken, "EX", 7 * 24 * 60 * 60);


            return {
                message: SuccessMessage.LOGIN_SUCCESS,
                accessToken,
                refreshToken,
                role: user.role!
            }

        } catch (error) {
            throw error
        }

    }
}