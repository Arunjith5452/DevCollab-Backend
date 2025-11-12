import { ContainerModule } from "inversify";
import { USER_TYPES } from "../../types/user";
import { UserRepository } from "@/infrastructure/db/repository/implements/user.repository";
import { Model } from "mongoose";
import { userModel } from "@/infrastructure/db/models/user.model";


export const UserModule = new ContainerModule(({bind})=>{
    bind<UserRepository>(USER_TYPES.UserRepository).to(UserRepository)
    bind<Model<any>>("UserModel").toConstantValue(userModel)
})