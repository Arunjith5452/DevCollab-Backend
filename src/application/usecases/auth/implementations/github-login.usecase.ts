import { GithubLoginDTO } from "@/application/dtos/auth/gitHub-Login.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { UserEntity } from "@/domain/entities/user.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { SuccessMessage } from "@/domain/enums/messages/success-message.enum";
import { Role } from "@/domain/enums/role.enum";
import { Status } from "@/domain/enums/status.enums";
import { AuthResult } from "@/domain/types/auth";
import { IUserRepository } from "@/domain/repository/user.interface";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { validateEmail } from "@/shared/utils/email-validate.util";
import { generateAccessToken, generateRefreshToken } from "@/shared/utils/jwt.util";
import { randomBytes } from "crypto";
import { inject, injectable } from "inversify";
import { COMMON_TYPES } from "@/infrastructure/di/types/common";
import { ICacheService } from "@/application/interface/cache.service.interface";

@injectable()
export class GitHubLoginUseCase implements IExecute<GithubLoginDTO, AuthResult> {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository<UserEntity>,
        @inject(COMMON_TYPES.CacheService) private readonly _cacheService: ICacheService
    ) { }

    async execute({ email, image, name, githubUrl, githubAccessToken }: GithubLoginDTO): Promise<AuthResult> {

        try {

            const isValidEmail = await validateEmail(email)

            if (!isValidEmail) throw new Error(ErrorMessage.EMAIL_INVALID)

            let user = await this._userRepository.findByEmail(email)

            if (!user) {

                const randomPassword = randomBytes(12).toString("hex");

                const newUser = UserEntity.create({
                    email,
                    username: name!,
                    password: randomPassword,
                    role: Role.USER,
                    status: Status.ACTIVE,
                    profileImage: image,
                    githubProfile: githubUrl,
                    githubAccessToken: githubAccessToken
                })

                const hashedPassword = await newUser.getHashedPassword();
                newUser.setPassword(hashedPassword)

                await this._userRepository.createUser(newUser)

                user = await this._userRepository.findByEmail(email)

                if (!user) {
                    throw new Error("Failed to retrieve newly created user.")
                }
            }

            if (user && githubAccessToken) {
                await this._userRepository.updateUser(user.id!, { githubAccessToken: githubAccessToken });
            }

            user.isBlocked()

            const payload = { userId: user.id, name: user.username, email: user.email, role: user.role }

            const jwtAccessToken = generateAccessToken(payload)
            const refreshToken = generateRefreshToken(payload)

            await this._cacheService.set(`refresh:${user.email}`, refreshToken, "EX",
                Number(process.env.REFRESH_TOKEN_MAX_AGE))

            return {
                message: SuccessMessage.LOGIN_SUCCESS,
                accessToken: jwtAccessToken,
                refreshToken,
                role: user.role
            }

        } catch (error) {
            throw error
        }

    }

}