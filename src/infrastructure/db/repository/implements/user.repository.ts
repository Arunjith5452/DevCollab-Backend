import {  HydratedDocument, Model } from "mongoose";
import { IUser } from "../../interface/user.inteface";
import { IUserRepositor } from "../interface/user.interface";
import { inject, injectable } from "inversify";
import { BaseRepository } from "./base.repository";
import { UserEntity } from "@/domain/entities/user.entity";

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepositor<IUser> {

    constructor(@inject("UserModel") model: Model<IUser>) {
        super(model)
    }

    async findByEmail(email: string): Promise<HydratedDocument<IUser> | null> {
        return await this.findOne({ email })
    }

   async updatePassword(userId: string, password: string): Promise<void> {
        this.update(userId, { password })
    }

    async createUser(data: UserEntity): Promise<HydratedDocument<IUser>>{
        return await this.create(data)
    }
}