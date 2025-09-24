import { inject } from "inversify";
import { IExecute } from "../interfaces/execute-usecase.interface";
import { USER_TYPES } from "@/infrastructure/di/types/user";
import { IUserRepositor } from "@/infrastructure/db/repository/interface/user.interface";
import { IUser } from "@/infrastructure/db/interface/user.inteface";
import { forgotPasswordDTO } from "@/application/dtos/auth/forgotPassword.dto";

export class ForgotPasswordUseCase implements IExecute<forgotPasswordDTO,void>{

    constructor(@inject(USER_TYPES.UserRepository) private readonly _userRepository : IUserRepositor<IUser>){}

  async execute({email}:forgotPasswordDTO): Promise<void> {
    
    try {


       let user =await this._userRepository.getUserByEmail(email)

       if(!user) throw new Error("User with this email does not exist")
        
        
        
    } catch (error) {
        
    }
        
    }



}