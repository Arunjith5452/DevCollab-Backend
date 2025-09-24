import { HydratedDocument, Model } from "mongoose";
import { IUser } from "../../interface/user.inteface";
import { IUserRepositor } from "../interface/user.interface";
import { UserEntity } from "@/domain/entities/user.entity";
import { inject, injectable } from "inversify";

@injectable()
export class UserRepository implements IUserRepositor<IUser>{
    private readonly _model:Model<HydratedDocument<IUser>>

    constructor(@inject("UserModel") model:Model<HydratedDocument<IUser>>){
        this._model = model
    }


    async createUser({name,email,password}:UserEntity):Promise<HydratedDocument<IUser>>{
        return await this._model.create({ name,email,password })
    }

    async getUserByEmail(email:string): Promise<HydratedDocument<IUser> | null>{
        return await this._model.findOne({email})
    }
}