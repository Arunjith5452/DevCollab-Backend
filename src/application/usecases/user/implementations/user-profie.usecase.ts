import { IExecute } from "@/application/interface/execute.usecase.interface";
import { UserEntity } from "@/domain/entities/user.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { inject, injectable } from "inversify";

@injectable()
export class GetUserProfileUseCase implements IExecute<{ userId: string }, UserEntity> {

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepositor<UserEntity>
    ) {}

    async execute({ userId }: { userId: string }):Promise<UserEntity> {
       try {

         const user = await this._userRepository.findById(userId);
        if (!user) throw new Error(ErrorMessage.USER_NOT_FOUND);

        return user
        
       } catch (error) {
         throw error
       }
    }
}
