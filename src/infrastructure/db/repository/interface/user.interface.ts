import { UserEntity } from "@/domain/entities/user.entity";
import { HydratedDocument } from "mongoose";
import { IBaseRepository } from "./base-repository.interface";


export interface IUserRepositor<T> extends IBaseRepository<T> {   
    findByEmail(email:string):Promise<T | null>
    updatePassword(userId:string,password:string):Promise<void>
    createUser(data:UserEntity):Promise<T>
}
