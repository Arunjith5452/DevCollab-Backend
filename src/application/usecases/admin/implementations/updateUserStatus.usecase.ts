import { UpdateStatusDTO } from "@/application/dtos/admin/updateStatus.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { UserEntity } from "@/domain/entities/user.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { SuccessMessage } from "@/domain/enums/messages/success-message.enum";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { inject, injectable } from "inversify";

@injectable()
export class UpdateUserStatusUseCase implements IExecute<{userId:string,newStatus:UpdateStatusDTO},{message:string,newStatus:string}>{

    constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository:IUserRepositor<UserEntity> ){}

    async execute ({userId,newStatus}:{userId:string,newStatus:UpdateStatusDTO}) :Promise<{message:string; newStatus:string}>{

        try {

            let user = await this._userRepository.findById(userId)

              if(!user){
                throw new Error(ErrorMessage.USER_NOT_FOUND)
            }

            let updatedUser = await this._userRepository.update(userId,{status:newStatus})

            return {
                message : SuccessMessage.USER_UPDATED,
                newStatus:updatedUser!.status
            }

            
        } catch (error) {

            throw error
            
        }

    }

}