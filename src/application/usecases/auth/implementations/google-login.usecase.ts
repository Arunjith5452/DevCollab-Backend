import { GoogleLoginDTO } from "@/application/dtos/auth/google-Login.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { UserEntity } from "@/domain/entities/user.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { SuccessMessage } from "@/domain/enums/messages/success-message.enum";
import { Role } from "@/domain/enums/role.enum";
import { Status } from "@/domain/enums/status.enums";
import { AuthResult } from "@/domain/types/auth";
import { randomBytes } from "crypto";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { redisClient } from "@/infrastructure/providers/redis/redis-client";
import { validateEmail } from "@/shared/utils/email-validate.util";
import { generateAccessToken, generateRefreshToken } from "@/shared/utils/jwt.util";
import { inject, injectable } from "inversify";


@injectable()
export class GoogleLoginUseCase implements IExecute<GoogleLoginDTO, AuthResult> {

    constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<UserEntity>) { }

    async execute({ email, name, googleId }: GoogleLoginDTO): Promise<AuthResult> {

        try {

            const isValidEmail = await validateEmail(email)

            if (!isValidEmail) throw new Error(ErrorMessage.EMAIL_INVALID)

            let user = await this._userRepository.findByEmail(email)

            if (!user) {

                const randomPassword = randomBytes(12).toString("hex");

                user = UserEntity.create({
                    email,
                    username: name!,
                    password: randomPassword,
                    googleId,
                    role: [Role.USER],
                    status: Status.ACTIVE
                })

                const hashedPassword = await user.getHashedPassword();
                user.setPassword(hashedPassword)

                await this._userRepository.createUser(user)

                console.log("user",user)
            }

            user.isBlocked()

            const payload = { userId: user.id, email: user.email, role: user.role }

            const accessToken = generateAccessToken(payload)
            const refreshToken = generateRefreshToken(payload)

            await redisClient.set(`refresh:${user.email}`, refreshToken, "EX",
                Number(process.env.REFRESH_TOKEN_MAX_AGE))

            return {
                message: SuccessMessage.LOGIN_SUCCESS,
                accessToken,
                refreshToken,
                role: user.role
            }

        } catch (error) {

            throw error

        }

    }

}