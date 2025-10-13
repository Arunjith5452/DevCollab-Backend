import { ResetPasswordDTO } from "@/application/dtos/auth/resetPassword.dto";
import { IExecute } from "../interfaces/execute-usecase.interface";
import { inject } from "inversify";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { IUser } from "@/infrastructure/db/interface/user.inteface";
import { UserEntity } from "@/domain/entities/user.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { SuccessMessage } from "@/domain/enums/messages/success-message.enum";




export class ResetPasswordUseCase implements IExecute<ResetPasswordDTO, { message: string }> {

    constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<IUser>) { }

    async execute({ email, newPassword, confirmPassword }: ResetPasswordDTO): Promise<{ message: string }> {

        try {

            if (newPassword !== confirmPassword) {
                throw new Error(ErrorMessage.PASSWORDS_DO_NOT_MATCH)
            }

            const user = await this._userRepository.findByEmail(email)

            if(!user) {
                throw new Error(ErrorMessage.USER_NOT_FOUND)
            }

            const userEntity = new UserEntity(user.name,user.email,newPassword)
            const hashedPassword = await userEntity.getHashedPassword();
            userEntity.setPassword(hashedPassword)

            await this._userRepository.updatePassword(user.id,userEntity.password)

             return { message:SuccessMessage.PASSWORD_RESET}

        } catch (error) {

            throw error

        }

    }

}