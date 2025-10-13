import { UserEntity } from "@/domain/entities/user.entity";
import { HydratedDocument } from "mongoose";


export interface IUserRepositor<T> {
    findByEmail(email:string):Promise<HydratedDocument<T> | null>
    updatePassword(userId:string,password:string):Promise<void>
    createUser(data:UserEntity):Promise<HydratedDocument<T>>
}
