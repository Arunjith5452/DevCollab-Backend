import { inject, injectable } from "inversify";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { IUser } from "@/infrastructure/db/interface/user.inteface";
import { LoginDTO } from "@/application/dtos/auth/login.dto";
import { validateEmail } from "@/shared/utils/email-validate.util";
import { verify } from "@/shared/utils/password-hash.utils";
import { generateAccessToken, generateRefreshToken } from "@/shared/utils/jwt.util";
import { redisClient } from "@/infrastructure/redis/redis-client";
import { IExecute } from "../interfaces/execute-usecase.interface";
import { AuthResult } from "@/domain/types/auth";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { SuccessMessage } from "@/domain/enums/messages/success-message.enum";


@injectable()
export class LoginUseCase implements IExecute<LoginDTO,AuthResult> {
    constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<IUser>) { }

    async execute({ email, password }: LoginDTO):Promise<AuthResult> {

        try {

            const isValidEmail = await validateEmail(email)

            if (!isValidEmail) throw new Error(ErrorMessage.EMAIL_INVALID)

            const user = await this._userRepository.findByEmail(email)
            if (!user) throw new Error(ErrorMessage.EMAIL_NOT_EXIST)

            const isPassword = await verify(user.password, password)

            if (!isPassword) throw new Error(ErrorMessage.INVALID_PASSWORD);

            const payload = { userId: user._id.toString(), email: user.email }

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            await redisClient.set(`refresh:${user.email}`, refreshToken, "EX", 7*24*60*60); 


            return { message: SuccessMessage.LOGIN_SUCCESS ,
                accessToken,
                refreshToken
             }

        } catch (error) {
            throw error
        }

    }
}