import { IExecute } from "@/application/interface/execute.usecase.interface";
import { UserEntity } from "@/domain/entities/user.entity";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { inject, injectable } from "inversify";

@injectable()
export class GitHubLoginUseCase implements IExecute<void,void>{

    constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository : IUserRepositor<UserEntity> ){}

    async execute(dto: void): Promise<void> {
        
        try {

            
            
        } catch (error) {
            
        }
        
    }

}