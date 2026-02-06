import { UpdateStatusDTO } from "@/application/dtos/admin/updateStatus.dto";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { UserApplicationMapper } from "@/application/mapper/user-application.mapper";
import { UserEntity } from "@/domain/entities/user.entity";
import { ErrorMessage } from "@/domain/enums/messages/error-message.enum";
import { SuccessMessage } from "@/domain/enums/messages/success-message.enum";
import { IUserRepository } from "@/domain/repository/user.interface";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { inject, injectable } from "inversify";

@injectable()
export class UpdateUserStatusUseCase implements IExecute<{userId:string,newStatus:UpdateStatusDTO},{message:string,newStatus:string}>{

    constructor(
        @inject(USER_TYPES.UserRepository) private readonly _userRepository:IUserRepository<UserEntity> ,
    private readonly _userMapper:UserApplicationMapper){}

    async execute ({userId,newStatus}:{userId:string,newStatus:UpdateStatusDTO}) :Promise<{message:string; newStatus:string}>{

        try {

            
            let user = await this._userRepository.findById(userId)
        

              if(!user){
                throw new Error(ErrorMessage.USER_NOT_FOUND)
            }

            let updatedUser = await this._userRepository.update(userId,{status:newStatus})


            if(!updatedUser){
                throw new Error(ErrorMessage.USER_UPDATE_FAILED)
            }
 
            let userDoc = this._userMapper.toResponse(updatedUser)

            return {
                message : SuccessMessage.USER_UPDATED,
                newStatus:userDoc.status
            }

            
        } catch (error) {

            throw error
            
        }

    }

}