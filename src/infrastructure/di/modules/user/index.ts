import { ContainerModule } from "inversify";
import { USER_TYPES } from "../../types/user";
import { UserRepository } from "@/infrastructure/db/repository/implements/user.repository";
import { Model } from "mongoose";
import { userModel } from "@/infrastructure/db/models/user.model";
import { GenerateSignedUrlUseCase } from "@/application/usecases/user/implementations/generateSignedUrl.usecase";
import { GetUserProfileUseCase } from "@/application/usecases/user/implementations/user-profie.usecase";
import { UpdateUserProfileUseCase } from "@/application/usecases/user/implementations/update-user-profile.usecase";
import { UserPresentationMapper } from "@/infrastructure/mappers/user-presentation.mapper";
import { IUser } from "@/infrastructure/db/interface/user.inteface";

export const UserModule = new ContainerModule(({ bind }) => {
    bind<UserRepository>(USER_TYPES.UserRepository).to(UserRepository)
    bind<Model<IUser>>("UserModel").toConstantValue(userModel)
    bind<GetUserProfileUseCase>(USER_TYPES.GetUserProfileUseCase).to(GetUserProfileUseCase)
    bind<UpdateUserProfileUseCase>(USER_TYPES.UpdateUserProfileUseCase).to(UpdateUserProfileUseCase)
    bind<GenerateSignedUrlUseCase>(USER_TYPES.GenerateSignedUrlUseCase).to(GenerateSignedUrlUseCase)
    bind<UserPresentationMapper>(USER_TYPES.UserPresentationMapper).to(UserPresentationMapper);
})